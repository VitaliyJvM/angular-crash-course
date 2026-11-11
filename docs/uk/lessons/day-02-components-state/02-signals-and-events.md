# Day 2 · Lesson 2 — signal() та події: статус-фільтр

[English](../../../en/lessons/day-02-components-state/02-signals-and-events.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** зберігати UI-стан у `signal()`, змінювати його з event binding і бачити точкове оновлення шаблону.

[← Попередній: Typed model, @for та @if](01-typed-model-and-control-flow.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: computed(): похідний стан і лічильники →](03-computed-derived-state.md)

## Why it matters

Signals — основний примітив стану в сучасному Angular: на них побудовані inputs, forms, resources і change detection у zoneless-режимі. Фільтри, вкладки, прапорці «відкрито/закрито» — усе це локальний стан компонента в `signal()`.

## Concept

`signal(initial)` повертає **getter-функцію** з методами запису:

```ts
const count = signal(0);
count();                    // read: 0 (у шаблоні теж із дужками: {{ count() }})
count.set(5);               // replace
count.update((c) => c + 1); // derive from previous
```

Читання сигналу в шаблоні реєструє шаблон як залежність; після `set`/`update` Angular оновлює лише ті компоненти, чиї шаблони цей сигнал читали. Signal порівнює значення через `Object.is`, тож об'єкти та масиви **замінюють новими**, а не мутують.

Event binding: `(click)="handler($event)"` — вираз праворуч виконується в контексті класу компонента.

| React | Angular | Застереження |
|---|---|---|
| `const [f, setF] = useState('ALL')` | `f = signal('ALL')` | signal — це об'єкт-поле класу, живе поза render-циклом; немає rules of hooks і stale closures |
| `setF(x)` / `setF(prev => …)` | `f.set(x)` / `f.update(prev => …)` | у React `setState` викликає повторний запуск функції компонента; в Angular клас не перевиконується, оновлюються лише bindings |
| `onClick={() => setF(x)}` | `(click)="f.set(x)"` | — |

## Follow along

1. Онови `shipment-list/shipment-list.ts` — список і фільтр стають сигналами:

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

`filterOptions` — константа, сигнал їй не потрібен: у signal кладуть лише те, що змінюється.

2. У `shipment-list.html` встав блок кнопок між `<h2>` і `<ul>`:

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

`[attr.aria-pressed]` — attribute binding: звичайний `[x]` пише в DOM **property**, а `[attr.x]` — в HTML-**атрибут**; ARIA-стани задають саме атрибутами.

3. У тому ж файлі заміни блок `<ul>` — тимчасово фільтруємо просто в шаблоні (у наступному уроці це стане `computed`):

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

Зверни увагу: `shipments` тепер signal, тому в шаблоні `shipments()`.

4. Перевір у браузері: клік по `DELIVERED` лишає 2 рядки, активна кнопка підсвічена.

## Try it yourself

Додай праворуч від фільтрів кнопку `Reset`, яка повертає фільтр у `'ALL'` і **disabled**, коли фільтр уже `'ALL'`. Нових полів у класі не потрібно. Hint: property binding `[disabled]` з Day 1 + `statusFilter.set(...)`. Після перевірки кнопку можна видалити.

## Verify / Expected result

- Клік по кожній з 4 кнопок змінює список: `ALL` → 5, `CREATED` → 1, `IN_TRANSIT` → 2, `DELIVERED` → 2.
- У DevTools → Elements активна кнопка має `class="active"` і `aria-pressed="true"`, решта — `aria-pressed="false"`.
- Фільтр перемикається з клавіатури (`Tab` + `Enter`/`Space`) — це безкоштовно, бо використано `<button>`, а не `<div (click)>`.

## Common mistake / Best practice

**Пастка:** мутувати значення в сигналі — `this.shipments().push(x)` або `shipment.status = 'DELIVERED'`. Посилання не змінилося → `Object.is` каже «те саме» → залежні `computed` і шаблон не оновлюються. **Правильно:** immutable update — `this.shipments.update((list) => [...list, x])`. Друга типова помилка — забути дужки: `@if (statusFilter === 'ALL')` порівнює функцію з рядком (compiler це ловить як помилку типів).

## Interview checkpoint

**Q: What is a signal in Angular?**

A: A signal is a reactive wrapper around a value. You read it by calling it and write with `set` or `update`. Angular tracks where each signal is read, so when the value changes it knows exactly which templates and computed values depend on it and updates only those.

**Q: How is `signal()` different from React's `useState`?**

A: `useState` is tied to the render cycle — setting state re-runs the whole component function and relies on hook ordering. A signal is a standalone object that can live in a component, a service or a plain module; updating it doesn't re-execute the component, it just notifies the dependents, with no dependency arrays or stale closures.

## Done when

- [ ] `shipments` і `statusFilter` — сигнали; у шаблоні читаються з `()`.
- [ ] 4 кнопки фільтра згенеровані через `@for` із `filterOptions`, активна має `aria-pressed="true"`.
- [ ] Клік по кнопці змінює видимий список без жодного ручного виклику change detection.
- [ ] Можеш пояснити, чому `push` у масив усередині сигналу не оновить UI.

---
Docs: [Signals overview](https://angular.dev/guide/signals) · [Event listeners](https://angular.dev/guide/templates/event-listeners) · [Binding](https://angular.dev/guide/templates/binding)

[← Попередній: Typed model, @for та @if](01-typed-model-and-control-flow.md) · [Наступний: computed(): похідний стан і лічильники →](03-computed-derived-state.md)
