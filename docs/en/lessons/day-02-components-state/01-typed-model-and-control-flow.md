# Day 2 · Lesson 1 — Typed model, @for and @if

**English** | [Українська](../../../uk/lessons/day-02-components-state/01-typed-model-and-control-flow.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 5 · try 2 · verify 1

**Learning outcome:** describe `Shipment` as a typed model and render a list of mock data with `@for` / `@empty` / `@if`.

[← Previous: NgModules vs Standalone](../day-01-fundamentals/06-ngmodules-vs-standalone.md) · [Course plan](../../COURSE-PLAN.md) · [Next: signal() and events: status filter →](02-signals-and-events.md)

## Why it matters

Almost every screen in an enterprise application is a list of typed entities from a REST API. A typed model catches template errors at compile time (Angular templates are type-checked), and `@for` with `track` determines how much of the DOM is recreated when the list is updated.

## Concept

- **Model** — a plain TypeScript `interface`/`type` in a file next to the feature. No Angular decorators.
- **Built-in control flow** (Angular 17+) — template syntax, no imports needed:

```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>Nothing here</li>
}

@if (user.isAdmin) { <button>Delete</button> } @else { <span>Read only</span> }
```

- `track` is **required**: it is the item's identity key for DOM reconciliation.
- Contextual variables are available inside `@for`: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd`.

| React | Angular | Caveat |
|---|---|---|
| `items.map(i => <li key={i.id}>)` | `@for (i of items; track i.id)` | `key` in React is optional (a warning), while a missing `track` is a compile error |
| `cond && <X/>` / ternary operator | `@if` / `@else if` / `@else` | this is a template block, not a JS expression; you don't write arbitrary JS (for example, `.map`) in a template |
| `items.length === 0 ? … : …` | `@empty` | — |

Legacy: in pre-v17 code you will see the structural directives `*ngIf` and `*ngFor` (with a `trackBy` function) — they require importing `CommonModule`/`NgIf`/`NgFor`. New templates are written with `@if`/`@for` only.

## Follow along

1. Create `src/app/features/shipments/shipment.model.ts`:

```ts
export const SHIPMENT_STATUSES = ['CREATED', 'IN_TRANSIT', 'DELIVERED'] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export interface Shipment {
  id: number;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  createdAt: string; // ISO 8601, as it would arrive from a REST API
}
```

`as const` + `(typeof X)[number]` gives you both a runtime array (for the filter buttons) and a union type — without an `enum`.

2. Create `src/app/features/shipments/shipment.mock.ts`:

```ts
import { Shipment } from './shipment.model';

export const MOCK_SHIPMENTS: Shipment[] = [
  { id: 1, trackingNumber: 'PF-1001', carrier: 'Nova Poshta', status: 'IN_TRANSIT', createdAt: '2026-11-02T09:15:00Z' },
  { id: 2, trackingNumber: 'PF-1002', carrier: 'DHL', status: 'DELIVERED', createdAt: '2026-10-28T14:40:00Z' },
  { id: 3, trackingNumber: 'PF-1003', carrier: 'Ukrposhta', status: 'CREATED', createdAt: '2026-11-08T08:05:00Z' },
  { id: 4, trackingNumber: 'PF-1004', carrier: 'DHL', status: 'IN_TRANSIT', createdAt: '2026-11-05T17:30:00Z' },
  { id: 5, trackingNumber: 'PF-1005', carrier: 'Nova Poshta', status: 'DELIVERED', createdAt: '2026-10-30T11:20:00Z' },
];
```

3. Replace the class in `shipment-list/shipment-list.ts` (the Day 1 demo code is no longer needed):

```ts
import { Component } from '@angular/core';
import { MOCK_SHIPMENTS } from '../shipment.mock';

@Component({
  imports: [],
  selector: 'app-shipment-list',
  styleUrl: './shipment-list.css',
  templateUrl: './shipment-list.html',
})
export class ShipmentList {
  protected readonly shipments = MOCK_SHIPMENTS;
}
```

4. Replace the whole of `shipment-list/shipment-list.html`:

```html
<h2>Shipments</h2>

<ul class="shipments">
  @for (shipment of shipments; track shipment.id) {
    <li>
      <strong>{{ shipment.trackingNumber }}</strong> · {{ shipment.carrier }} · {{ shipment.status }}
      @if (shipment.status === 'DELIVERED') {
        <span>✓</span>
      }
    </li>
  } @empty {
    <li class="muted">No shipments yet.</li>
  }
</ul>
```

5. Replace the whole of `shipment-list/shipment-list.css` (copy-paste, styles for the whole day):

```css
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.filters .active {
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}

.shipments {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}
```

6. `npm start` → five rows in the browser, with a ✓ next to `PF-1002` and `PF-1005`.

## Try it yourself

Add a sequence number in the format `1/5`, `2/5`, … before the tracking number, without adding new fields to the class. Hint: the `@for` contextual variables (`$index`, `$count`) are available directly inside the block. After checking, you can remove it — it isn't used later.

## Verify / Expected result

- Browser: 5 rows, ✓ only for `DELIVERED`.
- Temporarily set `shipments = []` → you see `No shipments yet.`; revert it.
- Write `shipment.trackingNo` in the template → `ng serve` shows the compile error `Property 'trackingNo' does not exist on type 'Shipment'`; fix it.

## Common mistake / Best practice

**Pitfall:** `track $index` (or tracking by an object that gets recreated). After sorting/filtering/insertion Angular reuses DOM nodes "by position": unnecessary DOM updates, loss of focus and of child components' local state. **Correct:** `track` by a stable business identifier (`shipment.id`); `$index` is only for static lists without an id.

## Interview checkpoint

**Q: Why is `track` required in `@for`, and what should you track by?**

A: Angular uses the track expression as the identity of each item to reconcile the DOM when the collection changes. Tracking by a stable unique key like an id lets it move or reuse existing nodes instead of destroying and recreating them. Tracking by index is only fine for static lists.

**Q: How does the built-in control flow differ from `*ngIf` / `*ngFor`?**

A: `@if`, `@for` and `@switch` are part of the template syntax, so they need no imports, have better type narrowing, a built-in `@empty` block, mandatory tracking and a faster diffing algorithm. `*ngIf` and `*ngFor` are structural directives you still see in legacy code.

## Done when

- [ ] `shipment.model.ts` exists with `SHIPMENT_STATUSES`, `ShipmentStatus`, `Shipment`, and `shipment.mock.ts` exists with 5 records.
- [ ] The list is rendered with `@for … track shipment.id` and an `@empty` block.
- [ ] A typo in a model field name in the template produces a compile error, not `undefined` at runtime.
- [ ] You can explain why `track shipment.id` rather than `track $index`.

---
Docs: [Control flow](https://angular.dev/guide/templates/control-flow) · [@for API](https://angular.dev/api/core/@for)

[← Previous: NgModules vs Standalone](../day-01-fundamentals/06-ngmodules-vs-standalone.md) · [Next: signal() and events: status filter →](02-signals-and-events.md)
