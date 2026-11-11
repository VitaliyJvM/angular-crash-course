# Day 4 · Lesson 3 — Signal Forms: the create-shipment form

**English** | [Українська](../../../uk/lessons/day-04-routing-forms/03-signal-forms-basics.md)

**Estimated time:** 15 min · **Time budget:** read 3 · code 9 · try 2 · verify 1

**Learning outcome:** `/shipments/new` has a working Signal Forms form that adds a shipment to `ShipmentStore` (in-memory) and returns to the list; the form's route is lazy loaded.

[← Previous: Route parameters: the ShipmentDetails page](02-route-params-details.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Validation, error messages and submit →](04-validation-and-submit.md)

## Why it matters

Forms are a core part of enterprise frontend work: creating/editing entities, filters, settings. In Angular, forms are part of the framework, and the approach you choose determines where the form state lives and how validation is written.

## Concept

**Signal Forms** (`@angular/forms/signals`, stable since Angular 22) are built around one idea: **your writable signal holding the model is the single source of truth**, and the form is a typed "view" over it.

```ts
model = signal({ trackingNumber: '', carrier: '' });
shipmentForm = form(this.model, (path) => {
  required(path.trackingNumber);
});
// shipmentForm.trackingNumber           -> field (bound to an input)
// shipmentForm.trackingNumber().value() -> value; .invalid(), .touched(), .errors() -> state
```

- `form(model, schema, options)` — creates a **field tree** whose structure is inferred from the model type (a typo in a field name is a compile error).
- `[formField]` (the `FormField` directive) — two-way binding between an input and a field.
- `[formRoot]` (the `FormRoot` directive) on `<form>` — sets `novalidate`, calls `preventDefault()` and invokes `submission.action` **only if the form is valid**.

**Why this is the main path of the course:** the application is already fully signal-based on Angular 22, so the form uses the same mental model as the rest of the code (signals + `computed`), with type inference and without subscriptions. The official recommendation: Signal Forms for new signal-based applications (v22+). At the same time, most existing enterprise codebases are written with Reactive Forms — we cover them compactly in Lesson 5.

React parallel: controlled inputs + React Hook Form + Zod schema ≈ model signal + `form()` + schema function. Caveat: in Angular this is a built-in framework API rather than a set of libraries; the schema here is a function with rules, not a separate validation object (although `validateStandardSchema` lets you plug in Zod).

**Being honest about the data:** there is no backend. The static JSON in `public/` is served via GET but cannot accept a POST, so `store.add()` only changes the in-memory signal — after a reload the new shipment disappears.

## Follow along

1. Add to `src/app/features/shipments/shipment.model.ts` (after `ShipmentStatus` and at the end of the file, respectively):

   ```ts
   export const CARRIERS = ['Nova Poshta', 'Ukrposhta', 'DHL'] as const;
   ```

   ```ts
   /** What the "new shipment" form collects; id, status and createdAt are assigned by the store. */
   export type NewShipment = Pick<Shipment, 'trackingNumber' | 'carrier'>;
   ```

2. In `shipment-store.ts` update the import and add a method at the end of the class:

   ```ts
   import { NewShipment, Shipment } from './shipment.model';
   ```

   ```ts
   /** In-memory only: there is no backend, so the new shipment disappears on page reload. */
   add(draft: NewShipment): Shipment {
     const shipment: Shipment = {
       ...draft,
       id: Math.max(0, ...this._shipments().map((s) => s.id)) + 1,
       status: 'CREATED',
       createdAt: new Date().toISOString(),
       events: [],
     };
     this._shipments.update((shipments) => [...shipments, shipment]);
     return shipment;
   }
   ```

3. Generate the component:

   ```bash
   npx ng generate component features/shipments/shipment-form --skip-tests
   ```

4. Replace `shipment-form/shipment-form.ts`:

   ```ts
   import { Component, inject, signal } from '@angular/core';
   import { form, FormField, FormRoot, required } from '@angular/forms/signals';
   import { Router, RouterLink } from '@angular/router';
   import { ShipmentStore } from '../shipment-store';
   import { CARRIERS, NewShipment } from '../shipment.model';

   @Component({
     imports: [FormField, FormRoot, RouterLink],
     selector: 'app-shipment-form',
     styleUrl: './shipment-form.css',
     templateUrl: './shipment-form.html',
   })
   export class ShipmentForm {
     private readonly store = inject(ShipmentStore);
     private readonly router = inject(Router);

     protected readonly carriers = CARRIERS;

     // The model signal is the single source of truth; the form is a typed view over it.
     protected readonly model = signal<NewShipment>({ trackingNumber: '', carrier: '' });

     protected readonly shipmentForm = form(
       this.model,
       (path) => {
         required(path.trackingNumber, { message: 'Tracking number is required.' });
         required(path.carrier, { message: 'Choose a carrier.' });
       },
       {
         submission: {
           // Runs only when the form is valid.
           action: async () => {
             this.store.add(this.model());
             await this.router.navigate(['/shipments']);
           },
         },
       },
     );
   }
   ```

   `action` is async: in a real application this is where you would `await` an HTTP POST, and the server errors returned from it would become field errors. `router.navigate([...])` is programmatic navigation (React: `useNavigate()`).

5. Replace `shipment-form/shipment-form.html`:

   ```html
   <h2>New shipment</h2>

   <form class="form" [formRoot]="shipmentForm">
     <div class="field">
       <label for="trackingNumber">Tracking number</label>
       <input
         id="trackingNumber"
         type="text"
         placeholder="PF-1234"
         [formField]="shipmentForm.trackingNumber"
       />
     </div>

     <div class="field">
       <label for="carrier">Carrier</label>
       <select id="carrier" [formField]="shipmentForm.carrier">
         <option value="">Select a carrier</option>
         @for (carrier of carriers; track carrier) {
           <option [value]="carrier">{{ carrier }}</option>
         }
       </select>
     </div>

     <div class="actions">
       <button type="submit">Add shipment</button>
       <a routerLink="/shipments">Cancel</a>
     </div>
   </form>

   <p class="muted">
     There is no backend: the shipment is added in memory and disappears after a page reload.
   </p>
   ```

   Every control has a `<label for>` ↔ `id` pair — this is basic accessibility: clicking the label focuses the field, and a screen reader announces its name.

6. Replace `shipment-form/shipment-form.css` (copy-paste):

   ```css
   .form {
     display: grid;
     gap: 12px;
     max-width: 360px;
   }

   .field {
     display: grid;
     gap: 4px;
   }

   .field .error {
     margin: 0;
     font-size: 0.9rem;
   }

   .actions {
     display: flex;
     align-items: center;
     gap: 12px;
   }
   ```

7. Add a **lazy** route to `app.routes.ts` — it must come **before** `shipments/:id`:

   ```ts
   {
     // Must be declared before 'shipments/:id', otherwise "new" would be matched as an id.
     path: 'shipments/new',
     loadComponent: () =>
       import('./features/shipments/shipment-form/shipment-form').then((m) => m.ShipmentForm),
     title: 'New shipment · ParcelFlow Lite',
   },
   ```

   `loadComponent` + dynamic `import()` — the form's code goes into a separate chunk and is loaded only on the first navigation (React: `React.lazy()`).

8. Add a second link to `nav` in `app.html` (after `Shipments`):

   ```html
   <a routerLink="/shipments/new" routerLinkActive="active" ariaCurrentWhenActive="page">
     New shipment
   </a>
   ```

## Try it yourself

Prove to yourself that the model is the source of truth: show a live preview of the model as JSON below the form and add a **Reset** button that clears both fields.

- Hint 1: `JsonPipe` from `@angular/common`.
- Hint 2: `model` is an ordinary `WritableSignal`; the button needs `type="button"`, otherwise it will submit the form.

## Verify / Expected result

- `New shipment` in the header opens the form; the tab title is `New shipment · ParcelFlow Lite`.
- Fill in `PF-2000` + any carrier → `Add shipment` → you are on `/shipments`, the list contains the new shipment with the status `CREATED`, and the Total counter has increased.
- Reload the page — the new shipment is gone (expected: in-memory).
- Submitting an empty form does nothing (`action` is not called); we will add error messages in the next lesson.
- `npx ng build` shows a separate lazy chunk `shipment-form`.

## Common mistake / Best practice

**Pitfall:** placing `shipments/:id` above `shipments/new`. Consequence: the Router matches `new` as an `id`, and `ShipmentDetails` opens with the message `Shipment #new not found`. **Correct:** declare static segments before parameterized ones (first match wins).

## Interview checkpoint

**Q: What are Signal Forms and how do they differ conceptually from Reactive Forms?**

A: In Signal Forms the source of truth is a writable signal that holds your model, and `form()` creates a typed field tree over it; field state like value, validity and touched is exposed as signals, and validation is declared in a schema function. In Reactive Forms the source of truth is a `FormGroup`/`FormControl` tree that you build explicitly, and changes are exposed as observables.

**Q: What is lazy loading of routes and why use it?**

A: With `loadComponent` or `loadChildren` and a dynamic import, the code for a route is split into a separate chunk and downloaded only when the user navigates there. It reduces the initial bundle size and startup time.

## Done when

- [ ] `/shipments/new` opens through the nav and via a direct URL.
- [ ] A valid form adds a shipment to the store and returns to `/shipments`.
- [ ] The `shipments/new` route comes before `shipments/:id` and uses `loadComponent`.
- [ ] You can explain why the shipment disappears after a reload.

---
Docs: [Signal Forms overview](https://angular.dev/guide/forms/signals/overview) · [Form models](https://angular.dev/guide/forms/signals/models) · [Lazy loading routes](https://angular.dev/guide/routing/define-routes#lazily-loaded-components-and-routes)

[← Previous: Route parameters: the ShipmentDetails page](02-route-params-details.md) · [Next: Validation, error messages and submit →](04-validation-and-submit.md)
