# Day 2 · Lesson 3 — computed(): derived state and counters

**English** | [Українська](../../../uk/lessons/day-02-components-state/03-computed-derived-state.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 4 · try 3 · verify 1

**Learning outcome:** move filtering and counters out of the template into `computed()` and explain why derived state is not stored separately.

[← Previous: signal() and events: status filter](02-signals-and-events.md) · [Course plan](../../COURSE-PLAN.md) · [Next: input(): the ShipmentCard component →](04-input-child-component.md)

## Why it matters

The most common source of UI bugs is duplicated state that someone forgot to keep in sync (`filteredItems` separate from `items`). In Angular, everything that can be calculated from other state is declared as a `computed()`: it is always consistent, cached and testable as a pure function.

## Concept

```ts
const price = signal(100);
const qty = signal(2);
const total = computed(() => price() * qty()); // read-only signal
```

- **Dependencies are tracked automatically** — they are the signals actually read during the last execution of the function.
- **Lazy + memoized:** the function doesn't run until someone reads `total()`; repeated reads return the cached value until the dependencies change.
- **Read-only:** a `computed` has no `set`. The function must be pure — no side effects and no writes to other signals.

| React | Angular | Caveat |
|---|---|---|
| `useMemo(() => f(a, b), [a, b])` | `computed(() => f(a(), b()))` | there is no dependency array — you can't "forget a dependency"; but a dependency read **after** an `await`/inside a callback won't be tracked |
| derived value directly in the component body | `computed` | in React a calculation in the body is repeated on every render; a `computed` is recalculated only when its dependencies change |

The problem with the code from the previous lesson: an `@if` inside a `@for` is logic in the template, and `@empty` won't fire when the filter has excluded all items (the collection itself isn't empty).

## Follow along

1. In `shipment-list/shipment-list.ts` add `computed` to the import:

```ts
import { Component, computed, signal } from '@angular/core';
```

2. Add to the class after `statusFilter`:

```ts
  protected readonly filteredShipments = computed(() => {
    const filter = this.statusFilter();
    const shipments = this.shipments();
    return filter === 'ALL' ? shipments : shipments.filter((s) => s.status === filter);
  });

  protected readonly counters = computed(() => {
    const shipments = this.shipments();
    return {
      total: shipments.length,
      inTransit: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
      delivered: shipments.filter((s) => s.status === 'DELIVERED').length,
    };
  });
```

`counters` depends only on `shipments` — switching the filter doesn't recalculate it.

3. In `shipment-list.html` insert the counters right after `<h2>`:

```html
<p class="muted">
  Total: {{ counters().total }} · In transit: {{ counters().inTransit }} · Delivered:
  {{ counters().delivered }}
</p>
```

4. Replace the `<ul>` block — the template is "dumb" again, all the logic is in the class:

```html
<ul class="shipments">
  @for (shipment of filteredShipments(); track shipment.id) {
    <li>
      <strong>{{ shipment.trackingNumber }}</strong> · {{ shipment.carrier }} · {{ shipment.status }}
    </li>
  } @empty {
    <li class="muted">No shipments match this filter.</li>
  }
</ul>
```

5. Browser: above the filters you see `Total: 5 · In transit: 2 · Delivered: 2`; the filters work as before.

## Try it yourself

Add a derived value `deliveredShare` — the percentage of delivered shipments out of the total (an integer) — and show it in the counters line: `… · Delivered: 2 (40%)`. Requirements: no new `signal()`; an empty list must not produce `NaN`. Hint: a `computed` can read another `computed`. After checking, you can roll it back — it isn't used later.

## Verify / Expected result

- Counters: `Total: 5 · In transit: 2 · Delivered: 2`, and they don't change when you switch the filter.
- Temporarily remove both `DELIVERED` records from `MOCK_SHIPMENTS` and click the `DELIVERED` filter → you see `No shipments match this filter.` (in the previous lesson there would have been an empty list here). Restore the data.
- Temporarily add `console.log('recompute filtered')` as the first line of `filteredShipments`: the log appears once per filter change, not on every read. Remove the log.

## Common mistake / Best practice

**Pitfall:** keeping derived state in a separate `signal` and synchronizing it manually (or through an `effect()`): `this.filtered.set(...)` in every handler. Forget a single call and the UI shows stale data; an `effect` used for synchronization causes an extra change detection cycle. **Correct:** a single source of truth (`shipments`, `statusFilter`) + `computed` for everything derived from them. Likewise, don't call methods such as `{{ getFiltered() }}` in the template — they run on every check of the component, with no caching.

## Interview checkpoint

**Q: What is `computed()` and how does it differ from a method called in the template?**

A: `computed` creates a read-only signal derived from other signals. It tracks its dependencies automatically, evaluates lazily and memoizes the result, so it only recalculates when a dependency actually changes. A template method re-runs on every change detection pass of that component and has no caching.

**Q: When would you use `computed` versus `effect`?**

A: `computed` is for deriving values — it's pure and returns a result. `effect` is for side effects that leave the signal graph, like logging, localStorage or imperative DOM/third-party APIs. Using an effect to copy one signal into another is an anti-pattern; that should be a `computed` or a `linkedSignal`.

## Done when

- [ ] `filteredShipments` and `counters` are declared as `computed`, and there is no `@if` inside `@for` in the template.
- [ ] `@empty` shows `No shipments match this filter.` when the filter finds nothing.
- [ ] The class has exactly two writable signals: `shipments` and `statusFilter`.
- [ ] You can explain the difference between `computed` and `useMemo` (automatic dependencies, lazy, no dependency array).

---
Docs: [Signals: computed](https://angular.dev/guide/signals#computed-signals) · [linkedSignal](https://angular.dev/guide/signals/linked-signal)

[← Previous: signal() and events: status filter](02-signals-and-events.md) · [Next: input(): the ShipmentCard component →](04-input-child-component.md)
