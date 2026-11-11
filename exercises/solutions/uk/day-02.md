# Solutions — Day 2 (Components, Templates & State)

[English](../en/day-02.md) | **Українська**

> ⚠️ Не читай наперед. Відкривай розділ лише після того, як сам(-а) виконав(-ла) відповідний **Try it yourself** (або витратив(-ла) на нього відведений час). Усі ці зміни тимчасові: фінальний стан Day 2 їх не містить.

## Lesson 1 — порядковий номер `1/5`

`shipment-list.html`, усередині `@for`:

```html
<li>
  {{ $index + 1 }}/{{ $count }} <strong>{{ shipment.trackingNumber }}</strong> · {{ shipment.carrier }} ·
  {{ shipment.status }}
</li>
```

`$index` і `$count` — неявні змінні блоку `@for`. Для вкладених циклів їм дають alias: `@for (…; track …; let i = $index)`.

## Lesson 2 — кнопка `Reset`

`shipment-list.html`, усередині `<div class="filters">` після `@for`:

```html
<button type="button" [disabled]="statusFilter() === 'ALL'" (click)="statusFilter.set('ALL')">
  Reset
</button>
```

Стан «чи можна скинути» не зберігається окремо — він виводиться з `statusFilter()` просто в binding.

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

`computed` читає інший `computed` — граф залежностей будується автоматично: `shipments → counters → deliveredShare`.

## Lesson 4 — input `compact`

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

Увага: `compact="true"` (без дужок) передав би **рядок** `'true'` і не пройшов би type-check. Щоб дозволити запис `<app-shipment-card compact />`, використовують `input(false, { transform: booleanAttribute })`.

## Lesson 5 — output `selected`

`shipment-card.ts`:

```ts
readonly selected = output<Shipment>();
```

`shipment-card.html` — `<button>`, щоб елемент був досяжним із клавіатури:

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

і під `</ul>`:

```html
@if (selectedShipment(); as selected) {
  <p>Selected: {{ selected.trackingNumber }} ({{ selected.carrier }})</p>
}
```

Нюанс для обговорення: після `Mark delivered` рядок `Selected` показує старий об'єкт (snapshot). Надійніше зберігати `selectedId` і виводити об'єкт через `computed(() => shipments().find(…))` — саме так зроблено на сторінці деталей у Day 4.

## Lesson 6 — життєвий цикл `ShipmentCard`

`shipment-card.ts` (тимчасово):

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

Результат (на свіжо завантаженій сторінці, до натискання «Mark delivered»):

- старт: 5 × `card created`;
- `ALL` → `DELIVERED`: 3 × `card destroyed` (PF-1001, PF-1003, PF-1004); картки PF-1002 і PF-1005 **не перестворюються** — `track shipment.id` зіставив їх з наявними DOM-вузлами;
- `DELIVERED` → `ALL`: 3 × `card created`.

Читати `this.shipment()` у самому constructor не можна (помилка `NG0950: Input is required but no value is available yet`), а в `onDestroy`-callback — можна, бо він виконується пізніше.
