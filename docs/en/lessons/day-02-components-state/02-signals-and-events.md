# Day 2 · Lesson 2 — signal() and events: status filter

**English** | [Українська](../../../uk/lessons/day-02-components-state/02-signals-and-events.md)

**Estimated time:** 10 min · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** keep UI state in a `signal()`, change it from an event binding and see the template update precisely where needed.

[← Previous: Typed model, @for and @if](01-typed-model-and-control-flow.md) · [Course plan](../../COURSE-PLAN.md) · [Next: computed(): derived state and counters →](03-computed-derived-state.md)

## Why it matters

Signals are the core state primitive in modern Angular: inputs, forms, resources and change detection in zoneless mode are all built on them. Filters, tabs, "open/closed" flags — all of that is local component state in a `signal()`.

## Concept

`signal(initial)` returns a **getter function** with write methods:

```ts
const count = signal(0);
count();                    // read: 0 (in a template also with parentheses: {{ count() }})
count.set(5);               // replace
count.update((c) => c + 1); // derive from previous
```

Reading a signal in a template registers the template as a dependency; after `set`/`update` Angular updates only the components whose templates read that signal. A signal compares values with `Object.is`, so objects and arrays are **replaced with new ones**, not mutated.

Event binding: `(click)="handler($event)"` — the expression on the right runs in the context of the component class.

| React | Angular | Caveat |
|---|---|---|
| `const [f, setF] = useState('ALL')` | `f = signal('ALL')` | a signal is an object held in a class field and lives outside the render cycle; there are no rules of hooks and no stale closures |
| `setF(x)` / `setF(prev => …)` | `f.set(x)` / `f.update(prev => …)` | in React `setState` re-runs the component function; in Angular the class is not re-executed, only the bindings are updated |
| `onClick={() => setF(x)}` | `(click)="f.set(x)"` | — |

## Follow along

1. Update `shipment-list/shipment-list.ts` — the list and the filter become signals:

```ts
import { Component, signal } from '@angular/core';
import { MOCK_SHIPMENTS } from '../shipment.mock';
import { Shipment, SHIPMENT_STATUSES, ShipmentStatus } from '../shipment.model';

type StatusFilter = ShipmentStatus | 'ALL';

@Component({
  imports: [],
  selector: 'app-shipment-list',
  styleUrl: './shipment-list.css',
  templateUrl: './shipment-list.html',
})
export class ShipmentList {
  protected readonly filterOptions: StatusFilter[] = ['ALL', ...SHIPMENT_STATUSES];

  protected readonly shipments = signal<Shipment[]>(MOCK_SHIPMENTS);
  protected readonly statusFilter = signal<StatusFilter>('ALL');
}
```

`filterOptions` is a constant and doesn't need a signal: you put into a signal only what changes.

2. In `shipment-list.html` insert the block of buttons between `<h2>` and `<ul>`:

```html
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
```

`[attr.aria-pressed]` is an attribute binding: a regular `[x]` writes to a DOM **property**, while `[attr.x]` writes to an HTML **attribute**; ARIA states are set specifically through attributes.

3. In the same file replace the `<ul>` block — for now we filter right in the template (in the next lesson this becomes a `computed`):

```html
<ul class="shipments">
  @for (shipment of shipments(); track shipment.id) {
    @if (statusFilter() === 'ALL' || shipment.status === statusFilter()) {
      <li>
        <strong>{{ shipment.trackingNumber }}</strong> · {{ shipment.carrier }} · {{ shipment.status }}
      </li>
    }
  } @empty {
    <li class="muted">No shipments yet.</li>
  }
</ul>
```

Note: `shipments` is now a signal, so in the template it is `shipments()`.

4. Check in the browser: clicking `DELIVERED` leaves 2 rows, and the active button is highlighted.

## Try it yourself

Add a `Reset` button to the right of the filters that sets the filter back to `'ALL'` and is **disabled** when the filter is already `'ALL'`. No new class fields are needed. Hint: the `[disabled]` property binding from Day 1 + `statusFilter.set(...)`. After checking, you can delete the button.

## Verify / Expected result

- Clicking each of the 4 buttons changes the list: `ALL` → 5, `CREATED` → 1, `IN_TRANSIT` → 2, `DELIVERED` → 2.
- In DevTools → Elements the active button has `class="active"` and `aria-pressed="true"`, the others have `aria-pressed="false"`.
- The filter can be switched from the keyboard (`Tab` + `Enter`/`Space`) — you get this for free because a `<button>` is used rather than a `<div (click)>`.

## Common mistake / Best practice

**Pitfall:** mutating the value inside a signal — `this.shipments().push(x)` or `shipment.status = 'DELIVERED'`. The reference hasn't changed → `Object.is` says "the same" → dependent `computed` values and the template are not updated. **Correct:** an immutable update — `this.shipments.update((list) => [...list, x])`. The second typical mistake is forgetting the parentheses: `@if (statusFilter === 'ALL')` compares a function with a string (the compiler catches this as a type error).

## Interview checkpoint

**Q: What is a signal in Angular?**

A: A signal is a reactive wrapper around a value. You read it by calling it and write with `set` or `update`. Angular tracks where each signal is read, so when the value changes it knows exactly which templates and computed values depend on it and updates only those.

**Q: How is `signal()` different from React's `useState`?**

A: `useState` is tied to the render cycle — setting state re-runs the whole component function and relies on hook ordering. A signal is a standalone object that can live in a component, a service or a plain module; updating it doesn't re-execute the component, it just notifies the dependents, with no dependency arrays or stale closures.

## Done when

- [ ] `shipments` and `statusFilter` are signals; in the template they are read with `()`.
- [ ] The 4 filter buttons are generated with `@for` from `filterOptions`, and the active one has `aria-pressed="true"`.
- [ ] Clicking a button changes the visible list without any manual change detection call.
- [ ] You can explain why a `push` into an array inside a signal won't update the UI.

---
Docs: [Signals overview](https://angular.dev/guide/signals) · [Event listeners](https://angular.dev/guide/templates/event-listeners) · [Binding](https://angular.dev/guide/templates/binding)

[← Previous: Typed model, @for and @if](01-typed-model-and-control-flow.md) · [Next: computed(): derived state and counters →](03-computed-derived-state.md)
