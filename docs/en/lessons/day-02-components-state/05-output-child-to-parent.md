# Day 2 · Lesson 5 — output(): child-to-parent events

**English** | [Українська](../../../uk/lessons/day-02-components-state/05-output-child-to-parent.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 4 · try 3 · verify 1

**Learning outcome:** send an event from `ShipmentCard` through `output<number>()` and update the state in the parent immutably.

[← Previous: input(): the ShipmentCard component](04-input-child-component.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Lifecycle, change detection, OnPush and zoneless →](06-lifecycle-and-change-detection.md)

## Why it matters

"Data down, events up" is the basic contract between components in Angular, the same as in React. The child doesn't change state it doesn't own; it announces an intent, and the owner of the state decides what to do. This keeps the data flow predictable and lets you move the state into a service tomorrow without touching the card.

## Concept

```ts
export class Rating {
  readonly rated = output<number>(); // an event with a payload of type number
  protected rate(stars: number) { this.rated.emit(stars); }
}
```

```html
<app-rating (rated)="save($event)" />
```

- The parent subscribes with the same syntax as for DOM events: `(eventName)="handler($event)"`; `$event` is the payload from `emit()`.
- `output()` is **not a signal**: it is an event channel with no current value. Angular cleans up the subscription itself when the component is destroyed.
- Custom outputs **do not bubble** (no bubbling) — only the direct parent can listen.
- The name is a past-tense fact/an action without the `on` prefix: `delivered`, `saved`, `closed`.

| React | Angular | Caveat |
|---|---|---|
| callback prop `onDelivered={(id) => …}` | `delivered = output<number>()` + `(delivered)="…"` | in React a callback is an ordinary prop (you can call it, check it for `undefined`, get a return value); an output is a one-way event emitter, the child doesn't know whether anyone is listening and gets nothing back |
| `props.onDelivered(id)` | `this.delivered.emit(id)` | — |

Legacy: `@Output() delivered = new EventEmitter<number>();` — usage in the parent's template is identical.

## Follow along

1. In `shipment-card/shipment-card.ts` add `output`:

```ts
import { Component, input, output } from '@angular/core';
```

```ts
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
  readonly delivered = output<number>();
}
```

2. In `shipment-card/shipment-card.html` add a button to `.card-actions` after the status badge:

```html
    @if (shipment().status !== 'DELIVERED') {
      <button type="button" (click)="delivered.emit(shipment().id)">Mark delivered</button>
    }
```

The card emits only the `id` — it doesn't know where or how the list is stored.

3. In `shipment-list/shipment-list.ts` add a method at the end of the class:

```ts
  protected markDelivered(id: number): void {
    this.shipments.update((shipments) =>
      shipments.map((s) => (s.id === id ? { ...s, status: 'DELIVERED' } : s)),
    );
  }
```

A new array and a new object for the changed item: the signal sees a new reference, `filteredShipments` and `counters` are recalculated, while the unchanged cards receive the same object in their input and are not updated.

4. In `shipment-list.html` subscribe to the event:

```html
      <app-shipment-card [shipment]="shipment" (delivered)="markDelivered($event)" />
```

5. Browser: click `Mark delivered` on `PF-1001` → the badge turns into a green `DELIVERED`, the button disappears, and the counters read `In transit: 1 · Delivered: 3`.

You can compare the final state of the Day 2 files with `app/src/app/features/shipments/` in the repository (it already contains changes from the following days — look only at `input`/`output` and the card template).

## Try it yourself

Add a second output `selected` to `ShipmentCard` that emits the **whole** `Shipment` **object** when the tracking number is clicked. In `ShipmentList` store the last selected shipment in a signal and show the line `Selected: PF-1003 (Ukrposhta)` below the list; if nothing is selected, the line is not rendered. Hints: the tracking number must be reachable from the keyboard (which element is suitable for that?); for conditional rendering with a local variable there is the `@if (expr; as name)` syntax. After checking, roll it back — on Day 4 the tracking number becomes a link to the details page.

## Verify / Expected result

- `Mark delivered` changes the card's status, hides the button and updates the counters.
- Turn on the `IN_TRANSIT` filter and click `Mark delivered` → the card **disappears** from the list (it no longer passes the filter) — no extra code was written for this.
- Reloading the page brings back the initial data: the state lives only in the component's memory.
- In `markDelivered` temporarily change the parameter type to `string` → a compile error in the template: the output payload is typed end to end. Change it back to `number`.

## Common mistake / Best practice

**Pitfall:** updating the state by mutation — `this.shipments().find((s) => s.id === id)!.status = 'DELIVERED'`. The array in the signal is the same → the `computed` values are not recalculated → the counters and the filter show old data (and the card may happen to update, which masks the bug). **Correct:** `update()` + `map` with spread, as in step 3. Best practice for outputs: emit a minimal payload (an id or a domain event) rather than a DOM `Event`, so that the parent doesn't depend on the child's markup.

## Interview checkpoint

**Q: How do components communicate in Angular?**

A: Parent to child through inputs, child to parent through outputs — data down, events up. For components that aren't directly related, you use a shared injectable service, typically exposing signals or observables. Two-way binding between parent and child is possible with `model()`.

**Q: What is `output()` and how does it compare to `@Output()` with `EventEmitter`?**

A: `output()` is the modern function-based API that declares a typed event a component can emit; the parent listens with the `(event)` syntax. It replaces `@Output() x = new EventEmitter()`, is consistent with `input()`, and isn't an RxJS Subject, so it can't be misused as a general-purpose stream. It's not a signal — it has no current value.

## Done when

- [ ] `ShipmentCard` has `delivered = output<number>()` and a `Mark delivered` button that is hidden for `DELIVERED`.
- [ ] `ShipmentList.markDelivered` updates the signal with `update` + `map`, without mutations.
- [ ] After a click the card, the counters and the filtered list are updated.
- [ ] `ShipmentCard` still has no `inject()` and doesn't import `ShipmentList`.

---
Docs: [Custom events with outputs](https://angular.dev/guide/components/outputs) · [Two-way binding / model()](https://angular.dev/guide/templates/two-way-binding)

[← Previous: input(): the ShipmentCard component](04-input-child-component.md) · [Next: Lifecycle, change detection, OnPush and zoneless →](06-lifecycle-and-change-detection.md)
