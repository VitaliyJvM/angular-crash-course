# Day 2 · Lesson 4 — input(): the ShipmentCard component

**English** | [Українська](../../../uk/lessons/day-02-components-state/04-input-child-component.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 5 · try 2 · verify 1

**Learning outcome:** extract a presentational `ShipmentCard` component and pass data to it through `input.required<Shipment>()`.

[← Previous: computed(): derived state and counters](03-computed-derived-state.md) · [Course plan](../../COURSE-PLAN.md) · [Next: output(): child-to-parent events →](05-output-child-to-parent.md)

## Why it matters

Production code is split into **container** components (which know about state and services) and **presentational** ones (which receive data through inputs and know nothing about where it comes from). Small presentational components are easy to reuse and test — we will test `ShipmentCard` on Day 5.

## Concept

A signal input is a read-only signal whose value is set by the parent through a property binding:

```ts
export class UserBadge {
  readonly name = input.required<string>(); // the parent must pass it
  readonly size = input(24);                // optional, default 24, type number is inferred
}
```

```html
<app-user-badge [name]="user.name" [size]="32" />
```

- `input.required` without a binding in the parent → a **compile error** (not `undefined` at runtime).
- An input is read like a signal: `name()`; you can build a `computed` on top of it.
- The child **cannot** write to an input — data flow is one-way (for two-way there is a separate `model()`).
- For the parent to be able to use `<app-shipment-card>`, the `ShipmentCard` class must be added to its `imports` — template dependencies in standalone components are explicit.

| React | Angular | Caveat |
|---|---|---|
| `function Card({ shipment }: Props)` | `shipment = input.required<Shipment>()` | props are function arguments; inputs are signal fields of the class, available both in `computed` and in the template |
| optional prop + default value | `input(defaultValue)` | — |
| `children` | `<ng-content />` (content projection) | outside the scope of this lesson |

Legacy: `@Input() shipment!: Shipment;` (+ `@Input({ required: true })` since v16). Decorator inputs are plain fields; you had to react to their changes through `ngOnChanges` or a setter.

## Follow along

1. Generate the component (from the `practice/` directory):

```bash
npx ng generate component features/shipments/shipment-card --skip-tests
```

`shipment-card/shipment-card.ts`, `.html` and `.css` have appeared.

2. Replace `shipment-card/shipment-card.ts`:

```ts
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Shipment } from '../shipment.model';

@Component({
  imports: [DatePipe],
  selector: 'app-shipment-card',
  styleUrl: './shipment-card.css',
  templateUrl: './shipment-card.html',
})
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
}
```

An input is the component's public API, hence `readonly` without `protected`. We import `DatePipe` because pipes are explicit template dependencies too.

3. Replace `shipment-card/shipment-card.html`:

```html
<article class="card">
  <div>
    <strong>{{ shipment().trackingNumber }}</strong>
    <span class="muted"> · {{ shipment().carrier }} · {{ shipment().createdAt | date: 'mediumDate' }}</span>
  </div>

  <div class="card-actions">
    <span class="status" [class]="'status-' + shipment().status">{{ shipment().status }}</span>
  </div>
</article>
```

4. Replace `shipment-card/shipment-card.css` (copy-paste):

```css
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: #eaeef2;
}

.status-IN_TRANSIT {
  background: #ddf4ff;
}

.status-DELIVERED {
  background: #dafbe1;
}
```

Component styles are **encapsulated**: `.card` here won't affect `.card` in other components.

5. In `shipment-list/shipment-list.ts` add the import and register the component:

```ts
import { ShipmentCard } from '../shipment-card/shipment-card';
// ...
  imports: [ShipmentCard],
```

6. In `shipment-list.html` replace the content of the `<li>` inside `@for`:

```html
    <li>
      <app-shipment-card [shipment]="shipment" />
    </li>
```

7. Browser: each shipment is a card with a date (`Nov 2, 2026`) and a colored status badge.

## Try it yourself

Add an optional boolean input `compact` (default `false`) to `ShipmentCard`: when it is `true`, the card doesn't show the carrier and the date. Turn it on from `ShipmentList` to check. Hints: `input(false)`; in the parent — `[compact]="true"`. After checking, roll the changes back — the final card is always full.

## Verify / Expected result

- 5 cards; the `IN_TRANSIT` badge is light blue, `DELIVERED` is green, `CREATED` is gray; the filters and counters work.
- Remove `[shipment]="shipment"` from `<app-shipment-card />` → the compile error `Required input 'shipment' from component ShipmentCard must be specified`. Put it back.
- Remove `ShipmentCard` from the list's `imports` → the error `'app-shipment-card' is not a known element`. Put it back.

## Common mistake / Best practice

**Pitfall:** injecting a stateful service into every small component ("because it's quicker") or mutating an object received through an input (`this.shipment().status = …`). The component becomes unfit for reuse and testing, and the mutation changes the parent's data bypassing signals — the UI won't update. **Correct:** a presentational component receives data through `input()` and **asks** the parent to make changes through `output()` (next lesson).

## Interview checkpoint

**Q: How do signal inputs differ from the `@Input()` decorator?**

A: `input()` returns a read-only signal, so the value is reactive — you can derive state from it with `computed` instead of using `ngOnChanges` or setters. `input.required` is enforced at compile time and the type is inferred. `@Input()` is the legacy decorator-based API: a plain mutable property with no built-in reactivity.

**Q: What's the difference between a presentational and a container component?**

A: A presentational component only receives data through inputs and emits events through outputs — no services, no knowledge of where data comes from. A container (smart) component injects services, owns state and wires presentational components together.

## Done when

- [ ] `ShipmentCard` exists, has `shipment = input.required<Shipment>()` and doesn't inject any services.
- [ ] `ShipmentList` imports `ShipmentCard` and renders `<app-shipment-card [shipment]="shipment" />` inside `@for`.
- [ ] The date is formatted with `DatePipe`, and the status has a colored badge.
- [ ] You have seen the compile error for a missing required input.

---
Docs: [Accepting data with input properties](https://angular.dev/guide/components/inputs) · [Pipes](https://angular.dev/guide/templates/pipes) · [Styling components](https://angular.dev/guide/components/styling)

[← Previous: computed(): derived state and counters](03-computed-derived-state.md) · [Next: output(): child-to-parent events →](05-output-child-to-parent.md)
