# Day 2 · Lesson 3 — computed(): похідний стан і лічильники

**Estimated time:** 10 хв · **Time budget:** read 2 · code 4 · try 3 · verify 1
**Learning outcome:** винести фільтрацію й лічильники з шаблону в `computed()` і пояснити, чому похідний стан не зберігають окремо.

[← Попередній: signal() та події: статус-фільтр](02-signals-and-events.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: input(): компонент ShipmentCard →](04-input-child-component.md)

## Why it matters

Найчастіше джерело багів у UI — дубльований стан, який забули синхронізувати (`filteredItems` окремо від `items`). У Angular усе, що можна обчислити з іншого стану, оголошують як `computed()`: воно завжди консистентне, кешується й тестується як чиста функція.

## Concept

```ts
const price = signal(100);
const qty = signal(2);
const total = computed(() => price() * qty()); // read-only signal
```

- **Залежності відстежуються автоматично** — це сигнали, реально прочитані під час останнього виконання функції.
- **Lazy + memoized:** функція не виконується, доки `total()` ніхто не читає; повторні читання повертають кеш, доки залежності не змінилися.
- **Read-only:** у `computed` немає `set`. Функція має бути чистою — без side effects і запису в інші сигнали.

| React | Angular | Застереження |
|---|---|---|
| `useMemo(() => f(a, b), [a, b])` | `computed(() => f(a(), b()))` | dependency array немає — неможливо «забути залежність»; але залежність, прочитана **після** `await`/у callback, не відстежиться |
| derived value прямо в тілі компонента | `computed` | у React обчислення в тілі повторюється на кожен render; `computed` перераховується лише при зміні залежностей |

Проблема коду з минулого уроку: `@if` усередині `@for` — це логіка в шаблоні, і `@empty` не спрацює, коли фільтр відсіяв усі елементи (колекція ж не порожня).

## Follow along

1. У `shipment-list/shipment-list.ts` додай `computed` до імпорту:

```ts
import { Component, computed, signal } from '@angular/core';
```

2. Додай у клас після `statusFilter`:

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

`counters` залежить лише від `shipments` — перемикання фільтра його не перераховує.

3. У `shipment-list.html` встав лічильники одразу після `<h2>`:

```html
<p class="muted">
  Total: {{ counters().total }} · In transit: {{ counters().inTransit }} · Delivered:
  {{ counters().delivered }}
</p>
```

4. Заміни блок `<ul>` — шаблон знову «тупий», уся логіка в класі:

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

5. Браузер: над фільтрами `Total: 5 · In transit: 2 · Delivered: 2`; фільтри працюють як раніше.

## Try it yourself

Додай похідне значення `deliveredShare` — відсоток доставлених посилок від загальної кількості (ціле число) — і покажи його в рядку лічильників: `… · Delivered: 2 (40%)`. Вимоги: жодного нового `signal()`; порожній список не має давати `NaN`. Hint: `computed` може читати інший `computed`. Після перевірки можеш відкотити — далі не використовується.

## Verify / Expected result

- Лічильники: `Total: 5 · In transit: 2 · Delivered: 2` і не змінюються при перемиканні фільтра.
- Тимчасово видали з `MOCK_SHIPMENTS` обидва записи `DELIVERED` і натисни фільтр `DELIVERED` → видно `No shipments match this filter.` (у минулому уроці тут був би порожній список). Поверни дані.
- Тимчасово додай `console.log('recompute filtered')` першим рядком у `filteredShipments`: лог з'являється один раз на зміну фільтра, а не на кожне читання. Прибери лог.

## Common mistake / Best practice

**Пастка:** тримати похідний стан в окремому `signal` і синхронізувати вручну (або через `effect()`): `this.filtered.set(...)` у кожному обробнику. Варто забути один виклик — і UI показує застарілі дані; `effect` для синхронізації дає зайвий цикл change detection. **Правильно:** один source of truth (`shipments`, `statusFilter`) + `computed` для всього, що з них виводиться. Так само не клич у шаблоні методи на кшталт `{{ getFiltered() }}` — вони виконуються на кожній перевірці компонента без кешу.

## Interview checkpoint

**Q: What is `computed()` and how does it differ from a method called in the template?**
A: `computed` creates a read-only signal derived from other signals. It tracks its dependencies automatically, evaluates lazily and memoizes the result, so it only recalculates when a dependency actually changes. A template method re-runs on every change detection pass of that component and has no caching.

**Q: When would you use `computed` versus `effect`?**
A: `computed` is for deriving values — it's pure and returns a result. `effect` is for side effects that leave the signal graph, like logging, localStorage or imperative DOM/third-party APIs. Using an effect to copy one signal into another is an anti-pattern; that should be a `computed` or a `linkedSignal`.

## Done when

- [ ] `filteredShipments` і `counters` оголошені як `computed`, у шаблоні немає `@if` усередині `@for`.
- [ ] `@empty` показує `No shipments match this filter.`, коли фільтр нічого не знайшов.
- [ ] У класі рівно два writable-сигнали: `shipments` і `statusFilter`.
- [ ] Можеш пояснити різницю `computed` vs `useMemo` (автоматичні залежності, lazy, без dependency array).

---
Docs: [Signals: computed](https://angular.dev/guide/signals#computed-signals) · [linkedSignal](https://angular.dev/guide/signals/linked-signal)

[← Попередній: signal() та події: статус-фільтр](02-signals-and-events.md) · [Наступний: input(): компонент ShipmentCard →](04-input-child-component.md)
