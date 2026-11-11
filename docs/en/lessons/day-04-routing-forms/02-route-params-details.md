# Day 4 · Lesson 2 — Route parameters: the ShipmentDetails page

**English** | [Українська](../../../uk/lessons/day-04-routing-forms/02-route-params-details.md)

**Estimated time:** 15 min · **Time budget:** read 3 · code 8 · try 3 · verify 1

**Learning outcome:** the `/shipments/:id` page shows the shipment details; the route parameter reaches the component as a signal input, and the loading / error / not found states are handled.

[← Previous: Routes and navigation](01-routes-and-navigation.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Signal Forms: the create-shipment form →](03-signal-forms-basics.md)

## Why it matters

Master–detail (list → entity page) is the most typical scenario in business applications. The details page has to work both when you navigate from the list and when the URL is opened directly or reloaded — a frequent source of bugs.

## Concept

The `:id` segment in `path` is a route parameter. There are two ways to read it in a component.

**Modern (the one we use):** `withComponentInputBinding()` — the Router itself binds path params, query params and route `data` to component inputs with the same name:

```ts
// route: { path: 'shipments/:id', component: ShipmentDetails }
readonly id = input.required<string>(); // value from the URL, always a string
```

**Classic (you will see it in legacy code and in interviews):** `ActivatedRoute`:

```ts
private readonly route = inject(ActivatedRoute);
readonly id = this.route.snapshot.paramMap.get('id');            // one-off read
readonly id$ = this.route.paramMap.pipe(map((p) => p.get('id'))); // Observable, reacts to changes
```

`snapshot` is not updated if the Router reuses the same component when navigating `/shipments/1` → `/shipments/2`; a signal input is updated automatically, so a `computed()` derived from it is always up to date.

React parallel: `const { id } = useParams()` ≈ `id = input.required<string>()`. Caveat: in Angular this is an ordinary component input, so the same component can be used without the Router as well (for example, in a test via `setInput`).

Guards and resolvers (route protection, preloading data) — **Optional / Outside 5-hour course**.

## Follow along

1. Generate the component:

   ```bash
   npx ng generate component features/shipments/shipment-details --skip-tests
   ```

   This component does not need styles: delete `shipment-details.css` and the `styleUrl` line (or leave the file empty — that is not an error).

2. Replace `src/app/features/shipments/shipment-details/shipment-details.ts`:

   ```ts
   import { DatePipe } from '@angular/common';
   import { Component, computed, inject, input } from '@angular/core';
   import { RouterLink } from '@angular/router';
   import { ShipmentStore } from '../shipment-store';

   @Component({
     imports: [DatePipe, RouterLink],
     selector: 'app-shipment-details',
     templateUrl: './shipment-details.html',
   })
   export class ShipmentDetails {
     protected readonly store = inject(ShipmentStore);

     /** Bound from the ':id' route parameter by withComponentInputBinding(). Always a string. */
     readonly id = input.required<string>();

     protected readonly shipment = computed(() =>
       this.store.shipments().find((s) => s.id === Number(this.id())),
     );

     constructor() {
       this.store.load(); // makes a direct link / page reload on /shipments/:id work
     }
   }
   ```

   The component does not keep its own copy of the shipment: `shipment` is derived state from the store and `id`.

3. Replace `shipment-details.html`:

   ```html
   <p><a routerLink="/shipments">← Back to shipments</a></p>

   @if (store.loading()) {
     <p role="status">Loading shipment…</p>
   } @else if (store.error(); as message) {
     <p class="error" role="alert">{{ message }}</p>
   } @else if (shipment(); as shipment) {
     <h2>{{ shipment.trackingNumber }}</h2>

     <dl>
       <dt>Carrier</dt>
       <dd>{{ shipment.carrier }}</dd>
       <dt>Status</dt>
       <dd>{{ shipment.status }}</dd>
       <dt>Created</dt>
       <dd>{{ shipment.createdAt | date: 'medium' }}</dd>
     </dl>

     @if (shipment.status !== 'DELIVERED') {
       <button type="button" (click)="store.markDelivered(shipment.id)">Mark delivered</button>
     }

     <h3>Tracking events</h3>
     <ol>
       @for (event of shipment.events ?? []; track event.timestamp) {
         <li>
           {{ event.timestamp | date: 'short' }} · {{ event.location }} — {{ event.description }}
         </li>
       } @empty {
         <li class="muted">No tracking events yet.</li>
       }
     </ol>
   } @else {
     <p class="error" role="alert">Shipment #{{ id() }} not found.</p>
   }
   ```

   `@if (shipment(); as shipment)` — reads the signal once and narrows the type to `Shipment` (without `undefined`) inside the block.

4. Add the route to `src/app/app.routes.ts` **before** the wildcard:

   ```ts
   import { ShipmentDetails } from './features/shipments/shipment-details/shipment-details';
   // ...
   { path: 'shipments/:id', component: ShipmentDetails, title: 'Shipment details · ParcelFlow Lite' },
   { path: '**', redirectTo: 'shipments' },
   ```

5. Enable input binding in `src/app/app.config.ts`:

   ```ts
   import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
   import { provideRouter, withComponentInputBinding } from '@angular/router';
   import { routes } from './app.routes';

   export const appConfig: ApplicationConfig = {
     providers: [
       provideBrowserGlobalErrorListeners(),
       // withComponentInputBinding(): route params (e.g. :id) are bound to component inputs.
       provideRouter(routes, withComponentInputBinding()),
     ],
   };
   ```

6. Turn the tracking number in the card into a link. In `shipment-card/shipment-card.ts`:

   ```ts
   import { RouterLink } from '@angular/router';
   // ...
   imports: [DatePipe, RouterLink],
   ```

   In `shipment-card/shipment-card.html` replace `<strong>{{ shipment().trackingNumber }}</strong>` with:

   ```html
   <a [routerLink]="['/shipments', shipment().id]">
     <strong>{{ shipment().trackingNumber }}</strong>
   </a>
   ```

   The array in `[routerLink]` is a list of URL segments; the Router assembles `/shipments/1` itself.

## Try it yourself

Add a **"Next shipment →"** link to the details page that leads to the shipment with the next `id` and is shown only when such a shipment exists.

- Hint 1: one more `computed()` that looks in `store.shipments()` for the shipment with `Number(id()) + 1`.
- Hint 2: note that the component is not recreated on navigation — only the `id` input changes.

## Verify / Expected result

- Clicking `PF-1001` in the list opens `/shipments/1` with three tracking events.
- Reload on `/shipments/1` — the page loads (briefly showing `Loading shipment…` first).
- `/shipments/999` shows `Shipment #999 not found.`
- `Mark delivered` on the details page hides the button; after `← Back to shipments` the status and counters in the list are updated (shared `ShipmentStore`).

## Common mistake / Best practice

**Pitfall:** forgetting `withComponentInputBinding()`. Consequence: the runtime error `NG0950: Input "id" is required but no value is available yet` — the code compiles, but the details page crashes. **Correct:** enable the feature in `provideRouter(...)`; and remember that a route param is always a `string`, so you need `Number(...)` before comparing it with a numeric `id`.

## Interview checkpoint

**Q: How do you read a route parameter in a component?**

A: The modern way is to enable `withComponentInputBinding()` and declare an input with the same name as the parameter, so the router binds it and it stays reactive. The classic way is injecting `ActivatedRoute` and reading `snapshot.paramMap` for a one-off value, or subscribing to the `paramMap` observable when the same component instance can be reused for different parameters.

**Q: Why can `ActivatedRoute.snapshot` be a problem?**

A: The snapshot is read once. If the router reuses the component for a new parameter value, the snapshot-based code keeps showing stale data, so you need the observable or a signal input instead.

## Done when

- [ ] `/shipments/:id` opens both from the list and via a direct URL/reload.
- [ ] `ShipmentDetails` receives `id` through `input.required<string>()`, without `ActivatedRoute`.
- [ ] The loading, error and not found states are handled.
- [ ] A status change on the details page is visible in the list.

---
Docs: [Read route state](https://angular.dev/guide/routing/read-route-state) · [withComponentInputBinding](https://angular.dev/api/router/withComponentInputBinding) · [Define routes](https://angular.dev/guide/routing/define-routes)

[← Previous: Routes and navigation](01-routes-and-navigation.md) · [Next: Signal Forms: the create-shipment form →](03-signal-forms-basics.md)
