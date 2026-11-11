# Day 4 · Lesson 5 — Signal Forms vs Reactive Forms vs template-driven

**English** | [Українська](../../../uk/lessons/day-04-routing-forms/05-forms-comparison-reactive.md)

**Estimated time:** 10 min · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** the same form works with Reactive Forms at `/shipments/new-reactive`, and you can explain the three approaches to forms and justify your choice.

[← Previous: Validation, error messages and submit](04-validation-and-submit.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Unit testing a service: ShipmentStore →](../day-05-quality-interview/01-testing-a-service.md)

## Why it matters

Signal Forms have been stable only since Angular 22, so the vast majority of existing enterprise codebases and interview questions are about Reactive Forms. You need to read `FormGroup`/`FormControl` confidently and explain how the approaches differ.

## Concept

| | Signal Forms | Reactive Forms | Template-driven |
| --- | --- | --- | --- |
| Source of truth | your writable signal holding the model | a `FormGroup` / `FormControl` tree | a model in the component; directives build the form |
| Form definition | `form(model, schema)` in the class | `FormBuilder.group({...})` in the class | in the template (`ngModel`) |
| Validation | schema function, rules by path | `Validators.*` on each control | attribute directives (`required`, `pattern`) |
| Reactivity | signals | Observables (`valueChanges`, `statusChanges`) | managed by Angular, async |
| Type safety | inferred from the model | typed forms (explicit, with nullable nuances) | minimal |
| Status | stable since v22 | stable, the established enterprise standard | stable |
| Best for | new signal-based applications | existing codebases, complex dynamic forms | simple forms (login, search) |

**How to choose.** A new application on Angular 22+ with signals → Signal Forms. An existing project on Reactive Forms → stay with them: they are fully supported, and rewriting working forms without a reason is not worth it. Template-driven — only for the simplest forms; logic in the template is hard to test and does not scale well.

Template-driven, for reference only (read only, do **not** add it to the application):

```ts
@Component({
  imports: [FormsModule],
  template: `
    <form #f="ngForm" (ngSubmit)="save()">
      <input name="trackingNumber" [(ngModel)]="trackingNumber" required pattern="PF-\\d{4}" />
      <button type="submit" [disabled]="f.invalid">Add</button>
    </form>
  `,
})
export class QuickForm {
  trackingNumber = '';
  save() { /* ... */ }
}
```

React parallel: Reactive Forms ≈ React Hook Form / Formik (form state in a separate object rather than in component fields); template-driven ≈ simple controlled inputs with `useState`. Caveat: in Angular all three approaches are an official part of the framework, so they look the same across different teams.

## Follow along

1. Manually create the file `src/app/features/shipments/shipment-form-reactive/shipment-form-reactive.ts`:

   ```ts
   import { Component, inject } from '@angular/core';
   import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
   import { Router } from '@angular/router';
   import { ShipmentStore } from '../shipment-store';
   import { CARRIERS } from '../shipment.model';

   /**
    * Compact Reactive Forms version of ShipmentForm, kept for comparison only.
    * This is the approach you will meet in most existing enterprise codebases.
    */
   @Component({
     imports: [ReactiveFormsModule],
     selector: 'app-shipment-form-reactive',
     template: `
       <h2>New shipment (Reactive Forms)</h2>

       <form [formGroup]="form" (ngSubmit)="submit()">
         <p>
           <label for="trackingNumber">Tracking number</label>
           <input id="trackingNumber" type="text" formControlName="trackingNumber" />
           @if (form.controls.trackingNumber.touched && form.controls.trackingNumber.errors; as errors) {
             @if (errors['required']) {
               <span class="error">Tracking number is required.</span>
             } @else if (errors['pattern']) {
               <span class="error">Use the format PF-0000.</span>
             }
           }
         </p>

         <p>
           <label for="carrier">Carrier</label>
           <select id="carrier" formControlName="carrier">
             <option value="">Select a carrier</option>
             @for (carrier of carriers; track carrier) {
               <option [value]="carrier">{{ carrier }}</option>
             }
           </select>
           @if (form.controls.carrier.touched && form.controls.carrier.invalid) {
             <span class="error">Choose a carrier.</span>
           }
         </p>

         <button type="submit">Add shipment</button>
       </form>
     `,
   })
   export class ShipmentFormReactive {
     private readonly store = inject(ShipmentStore);
     private readonly router = inject(Router);

     protected readonly carriers = CARRIERS;

     // The FormGroup owns the form state; validators are attached per control.
     protected readonly form = inject(FormBuilder).nonNullable.group({
       trackingNumber: ['', [Validators.required, Validators.pattern(/^PF-\d{4}$/)]],
       carrier: ['', Validators.required],
     });

     protected submit(): void {
       if (this.form.invalid) {
         this.form.markAllAsTouched();
         return;
       }
       this.store.add(this.form.getRawValue());
       this.router.navigate(['/shipments']);
     }
   }
   ```

2. Compare it with `ShipmentForm` — what to pay attention to:
   - the state belongs to the `FormGroup`, not to your signal; you read the values through `getRawValue()`;
   - `nonNullable` — without it `reset()` sets `null` and the field types become `string | null`;
   - errors are an object keyed by name (`errors['required']`), and the message texts live in the template;
   - the `invalid` check + `markAllAsTouched()` are written by hand (in Signal Forms `FormRoot` does this);
   - `touched`, `errors`, `invalid` are plain properties, not signals; to react to changes there is `valueChanges` (an Observable);
   - `router.navigate()` returns a `Promise<boolean>`. It is deliberately not awaited here because nothing follows it (`ShipmentForm` awaits it inside its `async` action). If your lint setup enables `no-floating-promises`, write `void this.router.navigate(...)` or make `submit()` `async` and `await` it.

3. Add the route to `app.routes.ts` after `shipments/new` and **before** `shipments/:id`:

   ```ts
   {
     path: 'shipments/new-reactive',
     loadComponent: () =>
       import('./features/shipments/shipment-form-reactive/shipment-form-reactive').then(
         (m) => m.ShipmentFormReactive,
       ),
     title: 'New shipment (Reactive Forms) · ParcelFlow Lite',
   },
   ```

4. Open `http://localhost:4200/shipments/new-reactive` (we do not add a link to the nav — this is a comparison example).

## Try it yourself

Show a live preview of the reactive form's value below it using `valueChanges` — without a manual `subscribe()`.

- Hint: the interop tool from Day 3 that turns an Observable into a signal and unsubscribes on its own; it needs an initial value.

## Verify / Expected result

- `/shipments/new-reactive`: submitting an empty form shows both errors; `abc` → `Use the format PF-0000.`; `PF-3000` + carrier → the shipment is in the list.
- `npx ng build` shows two separate lazy chunks: `shipment-form` and `shipment-form-reactive`.
- `npx ng test --no-watch` passes.
- The reactive version deliberately has no duplicate check — think about how you would add it (a custom `ValidatorFn`).

## Common mistake / Best practice

**Pitfall:** mixing approaches on a single control — for example, `[(ngModel)]` together with `formControlName`, or also keeping a copy of the form values in your own component fields. Consequence: two sources of truth that drift apart, and bugs that are hard to reproduce. **Correct:** one approach per form and one source of truth — the `FormGroup` in Reactive Forms, the model signal in Signal Forms.

## Interview checkpoint

**Q: What is the difference between template-driven and reactive forms?**

A: Template-driven forms are defined in the template with `ngModel`; Angular creates the form model implicitly, which is fine for simple forms but harder to test and scale. Reactive forms define an explicit `FormGroup`/`FormControl` tree in the component class with synchronous access to values, validators as functions, and observables like `valueChanges`, so they suit complex and dynamic forms.

**Q: Which forms approach would you choose for a new Angular 22 project, and for an existing one?**

A: For a new signal-based app I'd use Signal Forms: the model signal is the single source of truth, types are inferred, and validation lives in a schema. For an existing codebase built on Reactive Forms I'd stay with Reactive Forms — they're stable and fully supported — and adopt Signal Forms incrementally only where it pays off.

## Done when

- [ ] `/shipments/new-reactive` adds a shipment the same way as the main form.
- [ ] You can name the source of truth in each of the three approaches.
- [ ] You can explain `FormBuilder`, `Validators`, `nonNullable`, `markAllAsTouched()`, `getRawValue()`.
- [ ] At the end of Day 4: `npx ng build` and `npx ng test --no-watch` pass.

---
Docs: [Forms comparison](https://angular.dev/guide/forms/signals/comparison) · [Reactive forms](https://angular.dev/guide/forms/reactive-forms) · [Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)

[← Previous: Validation, error messages and submit](04-validation-and-submit.md) · [Next: Unit testing a service: ShipmentStore →](../day-05-quality-interview/01-testing-a-service.md)
