# Solutions — Day 2 (Components, Templates & State)

**English** | [Українська](../uk/day-02.md)

> ⚠️ Don't read ahead. Open a section only after you have completed the corresponding **Try it yourself** on your own (or spent the time allotted for it). All of these changes are temporary: the final state of Day 2 does not contain them.

## Lesson 1 — ordinal number `1/5`

`shipment-list.html`, inside `@for`:

```html
<li>
  {{ $index + 1 }}/{{ $count }} <strong>{{ shipment.trackingNumber }}</strong> · {{ shipment.carrier }} ·
  {{ shipment.status }}
</li>
```

`$index` and `$count` are implicit variables of the `@for` block. For nested loops they are given an alias: `@for (…; track …; let i = $index)`.

## Lesson 2 — `Reset` button

`shipment-list.html`, inside `<div class="filters">` after `@for`:

```html
<button type="button" [disabled]="statusFilter() === 'ALL'" (click)="statusFilter.set('ALL')">
  Reset
</button>
```

The "can it be reset" state is not stored separately — it is derived from `statusFilter()` right in the binding.

## Lesson 3 — `deliveredShare`

`shipment-list.ts`:

```ts
protected readonly deliveredShare = computed(() => {
  const { total, delivered } = this.counters();
  return total === 0 ? 0 : Math.round((delivered / total) * 100);
});
```

`shipment-list.html`:

```html
… · Delivered: {{ counters().delivered }} ({{ deliveredShare() }}%)
```

A `computed` reads another `computed` — the dependency graph is built automatically: `shipments → counters → deliveredShare`.

## Lesson 4 — `compact` input

`shipment-card.ts`:

```ts
readonly compact = input(false);
```

`shipment-card.html`:

```html
<strong>{{ shipment().trackingNumber }}</strong>
@if (!compact()) {
  <span class="muted"> · {{ shipment().carrier }} · {{ shipment().createdAt | date: 'mediumDate' }}</span>
}
```

`shipment-list.html`:

```html
<app-shipment-card [shipment]="shipment" [compact]="true" />
```

Note: `compact="true"` (without brackets) would pass the **string** `'true'` and would not pass type-checking. To allow writing `<app-shipment-card compact />`, use `input(false, { transform: booleanAttribute })`.

## Lesson 5 — `selected` output

`shipment-card.ts`:

```ts
readonly selected = output<Shipment>();
```

`shipment-card.html` — a `<button>`, so that the element is reachable from the keyboard:

```html
<button type="button" (click)="selected.emit(shipment())">
  <strong>{{ shipment().trackingNumber }}</strong>
</button>
```

`shipment-list.ts`:

```ts
protected readonly selectedShipment = signal<Shipment | null>(null);
```

`shipment-list.html`:

```html
<app-shipment-card
  [shipment]="shipment"
  (delivered)="markDelivered($event)"
  (selected)="selectedShipment.set($event)"
/>
```

and below `</ul>`:

```html
@if (selectedShipment(); as selected) {
  <p>Selected: {{ selected.trackingNumber }} ({{ selected.carrier }})</p>
}
```

A nuance worth discussing: after `Mark delivered`, the `Selected` line shows the old object (a snapshot). It is more reliable to store `selectedId` and derive the object through `computed(() => shipments().find(…))` — this is exactly how it is done on the details page in Day 4.

## Lesson 6 — `ShipmentCard` lifecycle

`shipment-card.ts` (temporarily):

```ts
import { Component, DestroyRef, inject, input, output } from '@angular/core';

export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
  readonly delivered = output<number>();

  constructor() {
    console.log('card created');
    inject(DestroyRef).onDestroy(() => console.log('card destroyed', this.shipment().trackingNumber));
  }
}
```

Result (on a fresh page load, before clicking “Mark delivered”):

- startup: 5 × `card created`;
- `ALL` → `DELIVERED`: 3 × `card destroyed` (PF-1001, PF-1003, PF-1004); the PF-1002 and PF-1005 cards are **not re-created** — `track shipment.id` matched them with the existing DOM nodes;
- `DELIVERED` → `ALL`: 3 × `card created`.

You cannot read `this.shipment()` in the constructor itself (error `NG0950: Input is required but no value is available yet`), but you can in the `onDestroy` callback, because it runs later.
