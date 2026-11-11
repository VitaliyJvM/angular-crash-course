# Day 2 · Lesson 5 — output(): подія від child до parent

[English](../../../en/lessons/day-02-components-state/05-output-child-to-parent.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 2 · code 4 · try 3 · verify 1

**Learning outcome:** надіслати подію з `ShipmentCard` через `output<number>()` та immutable-оновити стан у parent.

[← Попередній: input(): компонент ShipmentCard](04-input-child-component.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Lifecycle, change detection, OnPush і zoneless →](06-lifecycle-and-change-detection.md)

## Why it matters

«Data down, events up» — базовий контракт між компонентами в Angular, такий самий, як у React. Child не змінює чужий стан, а повідомляє про намір; власник стану вирішує, що робити. Це тримає потік даних передбачуваним і дозволяє завтра перенести стан у service, не чіпаючи картку.

## Concept

```ts
export class Rating {
  readonly rated = output<number>(); // подія з payload типу number
  protected rate(stars: number) { this.rated.emit(stars); }
}
```

```html
<app-rating (rated)="save($event)" />
```

- Parent підписується тим самим синтаксисом, що й на DOM-події: `(eventName)="handler($event)"`; `$event` — payload із `emit()`.
- `output()` — **не signal**: це канал подій без поточного значення. Підписку Angular прибирає сам під час знищення компонента.
- Custom outputs **не спливають** (no bubbling) — слухати може лише безпосередній parent.
- Назва — факт у минулому/дія без префікса `on`: `delivered`, `saved`, `closed`.

| React | Angular | Застереження |
|---|---|---|
| callback prop `onDelivered={(id) => …}` | `delivered = output<number>()` + `(delivered)="…"` | у React callback — звичайний prop (можна викликати, перевірити на `undefined`, отримати return value); output — односторонній event emitter, child не знає, чи хтось слухає, і нічого не отримує назад |
| `props.onDelivered(id)` | `this.delivered.emit(id)` | — |

Legacy: `@Output() delivered = new EventEmitter<number>();` — у шаблоні parent використання ідентичне.

## Follow along

1. У `shipment-card/shipment-card.ts` додай `output`:

```ts
import { Component, input, output } from '@angular/core';
```

```ts
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
  readonly delivered = output<number>();
}
```

2. У `shipment-card/shipment-card.html` додай кнопку в `.card-actions` після бейджа статусу:

```html
    @if (shipment().status !== 'DELIVERED') {
      <button type="button" (click)="delivered.emit(shipment().id)">Mark delivered</button>
    }
```

Картка емітить лише `id` — вона не знає, де і як зберігається список.

3. У `shipment-list/shipment-list.ts` додай метод у кінець класу:

```ts
  protected markDelivered(id: number): void {
    this.shipments.update((shipments) =>
      shipments.map((s) => (s.id === id ? { ...s, status: 'DELIVERED' } : s)),
    );
  }
```

Новий масив і новий об'єкт для зміненого елемента: signal бачить нове посилання, `filteredShipments` і `counters` перераховуються, а незмінені картки отримують той самий об'єкт у input і не оновлюються.

4. У `shipment-list.html` підпишись на подію:

```html
      <app-shipment-card [shipment]="shipment" (delivered)="markDelivered($event)" />
```

5. Браузер: натисни `Mark delivered` на `PF-1001` → бейдж стає зеленим `DELIVERED`, кнопка зникає, лічильники: `In transit: 1 · Delivered: 3`.

Фінальний стан файлів Day 2 можна звірити з `app/src/app/features/shipments/` у репозиторії (там уже є зміни наступних днів — дивись лише `input`/`output` і шаблон картки).

## Try it yourself

Додай до `ShipmentCard` другий output `selected`, який емітить **увесь об'єкт** `Shipment` при кліку на tracking number. У `ShipmentList` збережи останню вибрану посилку в сигналі й покажи під списком рядок `Selected: PF-1003 (Ukrposhta)`; якщо нічого не вибрано — рядок не рендериться. Hints: tracking number має бути досяжним із клавіатури (який елемент для цього підходить?); для умовного рендерингу з локальною змінною є синтаксис `@if (expr; as name)`. Після перевірки відкоти — на Day 4 tracking number стане посиланням на сторінку деталей.

## Verify / Expected result

- `Mark delivered` змінює статус картки, ховає кнопку й оновлює лічильники.
- Увімкни фільтр `IN_TRANSIT` і натисни `Mark delivered` → картка **зникає** зі списку (вона більше не проходить фільтр) — жодного додаткового коду для цього не писали.
- Reload сторінки повертає початкові дані: стан живе лише в пам'яті компонента.
- У `markDelivered` тимчасово заміни тип параметра на `string` → compile error у шаблоні: payload output типізований наскрізь. Поверни `number`.

## Common mistake / Best practice

**Пастка:** оновити стан мутацією — `this.shipments().find((s) => s.id === id)!.status = 'DELIVERED'`. Масив у сигналі той самий → `computed` не перераховуються → лічильники й фільтр показують старі дані (а картка може випадково оновитись, що маскує баг). **Правильно:** `update()` + `map` зі spread, як у кроці 3. Best practice для outputs: емітити мінімальний payload (id або подію предметної області), а не DOM-`Event`, щоб parent не залежав від розмітки child.

## Interview checkpoint

**Q: How do components communicate in Angular?**

A: Parent to child through inputs, child to parent through outputs — data down, events up. For components that aren't directly related, you use a shared injectable service, typically exposing signals or observables. Two-way binding between parent and child is possible with `model()`.

**Q: What is `output()` and how does it compare to `@Output()` with `EventEmitter`?**

A: `output()` is the modern function-based API that declares a typed event a component can emit; the parent listens with the `(event)` syntax. It replaces `@Output() x = new EventEmitter()`, is consistent with `input()`, and isn't an RxJS Subject, so it can't be misused as a general-purpose stream. It's not a signal — it has no current value.

## Done when

- [ ] `ShipmentCard` має `delivered = output<number>()` і кнопку `Mark delivered`, приховану для `DELIVERED`.
- [ ] `ShipmentList.markDelivered` оновлює сигнал через `update` + `map`, без мутацій.
- [ ] Після кліку оновлюються картка, лічильники й відфільтрований список.
- [ ] `ShipmentCard` як і раніше не має жодного `inject()` і не імпортує `ShipmentList`.

---
Docs: [Custom events with outputs](https://angular.dev/guide/components/outputs) · [Two-way binding / model()](https://angular.dev/guide/templates/two-way-binding)

[← Попередній: input(): компонент ShipmentCard](04-input-child-component.md) · [Наступний: Lifecycle, change detection, OnPush і zoneless →](06-lifecycle-and-change-detection.md)
