# Day 3 · Lesson 4 — Loading / error / empty states

**English** | [Українська](../../../uk/lessons/day-03-services-http/04-loading-error-empty-states.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 4 · try 2 · verify 2

**Learning outcome:** show the four mutually exclusive states of asynchronous data in the template — loading, error (with Retry), empty, content.

[← Previous: HttpClient: GET from a JSON fixture](03-httpclient-get-fixture.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Observable basics and safe subscriptions: debounced search →](05-observables-and-interop.md)

## Why it matters

The network is slow and unreliable. A screen that only handles the "happy path" shows a blank area in production or misleads the user ("there are no shipments", when the request simply failed). Handling every state is a baseline code review requirement.

## Concept

The state is already in the store as three signals: `loading()`, `error()`, `shipments()`. The template only picks one branch via `@if / @else if / @else`:

```html
@if (store.loading()) { … } @else if (store.error(); as message) { … } @else { … }
```

- `as message` stores the result of the expression in a local template variable.
- The order of the branches matters: loading first, then error, then empty, and only then the content.
- Accessibility: `role="status"` for the loading indicator and `role="alert"` for the error — a screen reader will announce the change.

React parallel: `if (isLoading) return <Spinner/>; if (error) return <Error/>; …` — the same logic, but declaratively in the template. TanStack Query (`isLoading`, `error`, `data`) and Angular's `httpResource` (Lesson 6) give you the same thing out of the box.

## Follow along

1. Replace the contents of `src/app/features/shipments/shipment-list/shipment-list.html`:

   ```html
   <h2>Shipments</h2>

   @if (store.loading()) {
     <p role="status">Loading shipments…</p>
   } @else if (store.error(); as message) {
     <p class="error" role="alert">{{ message }}</p>
     <button type="button" (click)="store.load()">Retry</button>
   } @else if (store.shipments().length === 0) {
     <p class="muted">No shipments yet.</p>
   } @else {
     <p class="muted">
       Total: {{ counters().total }} · In transit: {{ counters().inTransit }} · Delivered:
       {{ counters().delivered }}
     </p>

     <div class="filters" role="group" aria-label="Filter by status">
       @for (option of filterOptions; track option) {
         <button
           type="button"
           [class.active]="statusFilter() === option"
           [attr.aria-pressed]="statusFilter() === option"
           (click)="statusFilter.set(option)"
         >
           {{ option }}
         </button>
       }
     </div>

     <ul class="shipments">
       @for (shipment of filteredShipments(); track shipment.id) {
         <li>
           <app-shipment-card [shipment]="shipment" (delivered)="store.markDelivered($event)" />
         </li>
       } @empty {
         <li class="muted">No shipments match the current filters.</li>
       }
     </ul>
   }
   ```

   Note the two different "empty" states: "there is no data at all" (`No shipments yet.`) and "the filter found nothing" (`@empty`).

2. See **loading**: DevTools → Network → throttling "Slow 4G" → refresh the page. `Loading shipments…` appears for a moment. Switch back to "No throttling".

3. See **error**: in `shipment-api.ts` temporarily change the URL to `'data/shipments-missing.json'`. After reloading the page — a red message and a Retry button (the dev server responds with 404, and that ends up in the `error` callback). Click Retry: a new request appears in Network, because after the error `loaded` stayed `false`.

4. Change the URL back to `'data/shipments.json'`.

## Try it yourself

See the third state — **empty** — without changing `shipments.json`. Make the application temporarily receive an empty array and confirm that `No shipments yet.` is shown rather than counters with zeros. Then put everything back.

Hint: you can put one more file into `public/data/`.

## Verify / Expected result

- Throttling → `Loading shipments…` is visible, and after loading — the list.
- Broken URL → `Could not load shipments. Please try again.` + Retry; an HTTP error in the browser console.
- Correct URL → the list, the filter and "Mark delivered" work as before.
- A filter with no matches shows `No shipments match the current filters.`

## Common mistake / Best practice

**Pitfall:** modelling the state with several independent conditions `@if (loading) … @if (error) … @if (items.length === 0) …`. While loading, the array is empty, so the user sees "Loading…" and "No shipments yet." at the same time.

**Do this instead:** a single `@if / @else if / @else` chain with mutually exclusive branches, and always reset the error state before a new attempt (`this._error.set(null)` in `load()`).

## Interview checkpoint

**Q: How do you handle loading and error states for HTTP data in Angular?**

A: I keep the request state next to the data — for example `loading`, `error` and the value as signals in a service, or use `httpResource`, which exposes the same things. The template renders mutually exclusive branches with `@if / @else if`: loading, error with a retry action, empty, and content. Errors are caught in the data layer and turned into a user-friendly message, not left unhandled.

## Done when

- [ ] The template has four branches: loading, error + Retry, empty, content.
- [ ] You have seen the loading and error states in the browser.
- [ ] The URL in `ShipmentApi` is `'data/shipments.json'` again and the list is displayed.
- [ ] You can explain the difference between `No shipments yet.` and `@empty`.

---
Docs: [Control flow: @if, @for, @empty](https://angular.dev/guide/templates/control-flow) · [HTTP: handling request failure](https://angular.dev/guide/http/making-requests#handling-request-failure)

[← Previous: HttpClient: GET from a JSON fixture](03-httpclient-get-fixture.md) · [Next: Observable basics and safe subscriptions: debounced search →](05-observables-and-interop.md)
