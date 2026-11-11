# Day 2 · Lesson 1 — Typed model, @for та @if

**Estimated time:** 10 хв · **Time budget:** read 2 · code 5 · try 2 · verify 1
**Learning outcome:** описати `Shipment` як typed model і відрендерити список mock-даних через `@for` / `@empty` / `@if`.

[← Попередній: NgModules vs Standalone](../day-01-fundamentals/06-ngmodules-vs-standalone.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: signal() та події: статус-фільтр →](02-signals-and-events.md)

## Why it matters

Майже кожен екран enterprise-застосунку — це список типізованих сутностей із REST API. Typed model ловить помилки в шаблоні ще на етапі компіляції (Angular templates type-checked), а `@for` з `track` визначає, скільки DOM буде перестворено при оновленні списку.

## Concept

- **Model** — звичайний TypeScript `interface`/`type` у файлі поруч із feature. Жодних Angular-декораторів.
- **Built-in control flow** (Angular 17+) — синтаксис шаблону, імпорти не потрібні:

```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>Nothing here</li>
}

@if (user.isAdmin) { <button>Delete</button> } @else { <span>Read only</span> }
```

- `track` **обов'язковий**: це ключ ідентичності елемента для DOM-reconciliation.
- У `@for` доступні контекстні змінні: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd`.

| React | Angular | Застереження |
|---|---|---|
| `items.map(i => <li key={i.id}>)` | `@for (i of items; track i.id)` | `key` у React опційний (warning), `track` — помилка компіляції без нього |
| `cond && <X/>` / тернарний оператор | `@if` / `@else if` / `@else` | це не JS-вираз, а блок шаблону; довільний JS (наприклад, `.map`) у шаблоні не пишуть |
| `items.length === 0 ? … : …` | `@empty` | — |

Legacy: у коді до v17 побачиш structural directives `*ngIf`, `*ngFor` (з `trackBy`-функцією) — вони потребують імпорту `CommonModule`/`NgIf`/`NgFor`. Нові шаблони пишуть лише на `@if`/`@for`.

## Follow along

1. Створи `src/app/features/shipments/shipment.model.ts`:

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

`as const` + `(typeof X)[number]` дає і runtime-масив (для кнопок фільтра), і union type — без `enum`.

2. Створи `src/app/features/shipments/shipment.mock.ts`:

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

3. Заміни клас у `shipment-list/shipment-list.ts` (демо-код Day 1 більше не потрібен):

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

4. Заміни весь `shipment-list/shipment-list.html`:

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

5. Заміни весь `shipment-list/shipment-list.css` (copy-paste, стилі на весь день):

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

6. `npm start` → у браузері п'ять рядків, біля `PF-1002` і `PF-1005` стоїть ✓.

## Try it yourself

Додай перед tracking number порядковий номер у форматі `1/5`, `2/5`, … без нових полів у класі. Hint: контекстні змінні `@for` (`$index`, `$count`) доступні прямо в блоці. Після перевірки можеш прибрати — далі це не використовується.

## Verify / Expected result

- Браузер: 5 рядків, ✓ лише для `DELIVERED`.
- Тимчасово зроби `shipments = []` → видно `No shipments yet.`; поверни назад.
- Напиши в шаблоні `shipment.trackingNo` → `ng serve` показує помилку компіляції `Property 'trackingNo' does not exist on type 'Shipment'`; виправ.

## Common mistake / Best practice

**Пастка:** `track $index` (або трекінг за об'єктом, який перестворюється). Після сортування/фільтрації/вставки Angular перевикористовує DOM-вузли «за позицією»: зайві оновлення DOM, втрата фокуса та локального стану дочірніх компонентів. **Правильно:** `track` за стабільним бізнес-ідентифікатором (`shipment.id`); `$index` — лише для статичних списків без id.

## Interview checkpoint

**Q: Why is `track` required in `@for`, and what should you track by?**
A: Angular uses the track expression as the identity of each item to reconcile the DOM when the collection changes. Tracking by a stable unique key like an id lets it move or reuse existing nodes instead of destroying and recreating them. Tracking by index is only fine for static lists.

**Q: How does the built-in control flow differ from `*ngIf` / `*ngFor`?**
A: `@if`, `@for` and `@switch` are part of the template syntax, so they need no imports, have better type narrowing, a built-in `@empty` block, mandatory tracking and a faster diffing algorithm. `*ngIf` and `*ngFor` are structural directives you still see in legacy code.

## Done when

- [ ] Є `shipment.model.ts` із `SHIPMENT_STATUSES`, `ShipmentStatus`, `Shipment` та `shipment.mock.ts` із 5 записами.
- [ ] Список рендериться через `@for … track shipment.id` з блоком `@empty`.
- [ ] Помилка в назві поля моделі в шаблоні дає compile error, а не `undefined` у runtime.
- [ ] Можеш пояснити, чому `track shipment.id`, а не `track $index`.

---
Docs: [Control flow](https://angular.dev/guide/templates/control-flow) · [@for API](https://angular.dev/api/core/@for)

[← Попередній: NgModules vs Standalone](../day-01-fundamentals/06-ngmodules-vs-standalone.md) · [Наступний: signal() та події: статус-фільтр →](02-signals-and-events.md)
