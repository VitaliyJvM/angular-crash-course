# Day 1 · Lesson 5 — Template bindings

[English](../../../en/lessons/day-01-fundamentals/05-template-bindings.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** використовуєш interpolation, property binding, class binding та event binding і читаєш цей синтаксис у чужому коді.

[← Попередній: Перший компонент](04-first-component.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: NgModules vs Standalone →](06-ngmodules-vs-standalone.md)

## Why it matters

Bindings — це весь «клей» між класом компонента і DOM. Чотири форми синтаксису покривають 95% templates, які ти побачиш у production-коді.

## Concept

| Binding | Angular | React (JSX) |
|---------|---------|-------------|
| Текст | `{{ carrier }}` | `{carrier}` |
| DOM property | `[disabled]="isFull()"` | `disabled={isFull}` |
| Attribute | `[attr.aria-label]="label"` | `aria-label={label}` |
| CSS class | `[class.full]="isFull()"` | `className={isFull ? 'full' : ''}` |
| Подія | `(click)="addParcel()"` | `onClick={addParcel}` |

Правила читання: **`[ ]` — дані йдуть у елемент, `( )` — події йдуть з елемента.** Вираз у лапках — це не рядок, а TypeScript-подібний вираз, який обчислюється в контексті класу компонента.

Signal у template читається викликом: `{{ parcelCount() }}`. Angular запам'ятовує, що цей binding залежить від signal, і оновлює його при зміні значення.

> Застереження: template — не JSX. Тут не можна писати довільний JavaScript (`map`, оголошення змінних, `new`); для розгалужень і циклів є окремий синтаксис `@if` / `@for` (Day 2). Члени класу, які використовує template, мають бути `public` або `protected`, не `private`.

## Follow along

1. Заміни вміст `src/app/features/shipments/shipment-list/shipment-list.ts`:

   ```ts
   import { Component, signal } from '@angular/core';

   @Component({
     imports: [],
     selector: 'app-shipment-list',
     styleUrl: './shipment-list.css',
     templateUrl: './shipment-list.html',
   })
   export class ShipmentList {
     protected readonly carrier = 'Nova Poshta';
     protected readonly maxParcels = 5;
     protected readonly parcelCount = signal(3);

     protected addParcel(): void {
       this.parcelCount.update((count) => count + 1);
     }
   }
   ```

2. Заміни вміст `shipment-list.html`:

   ```html
   <h2>Shipments</h2>

   <p>
     Carrier: <strong>{{ carrier }}</strong>, parcels: <strong>{{ parcelCount() }}</strong>
   </p>

   <button
     type="button"
     [disabled]="parcelCount() >= maxParcels"
     [class.full]="parcelCount() >= maxParcels"
     (click)="addParcel()"
   >
     Add parcel
   </button>
   ```

3. Додай у `shipment-list.css`:

   ```css
   .full {
     border-color: var(--danger);
   }
   ```

4. У браузері натисни **Add parcel** двічі: лічильник стане 5, кнопка — disabled із червоною рамкою.

## Try it yourself

Додай другу кнопку **Reset**, яка повертає лічильник до 3 і активна лише тоді, коли лічильник більший за 3.

Hint: у signal є метод `set(value)`.

## Verify / Expected result

- Після двох кліків: `parcels: 5`, **Add parcel** неактивна.
- **Reset** повертає `parcels: 3`, знову активує **Add parcel** і сама стає неактивною.
- У терміналі з `ng serve` немає помилок компіляції.

## Common mistake / Best practice

**Помилка:** написати `disabled="{{ isFull }}"` або `disabled="false"` за аналогією з HTML. **Наслідок:** атрибут `disabled` присутній завжди (будь-який рядок, навіть `"false"`, вмикає його), кнопка заблокована назавжди. **Правильно:** для нетекстових значень використовуй property binding `[disabled]="expr"`.

**Best practice:** члени класу для template оголошуй `protected readonly` — template має доступ, зовнішній код не може їх змінити.

## Interview checkpoint

**Q: What kinds of data binding does Angular have?**

A: Interpolation `{{ }}` for text, property binding `[prop]` for passing values into elements or components, event binding `(event)` for reacting to events, and two-way binding `[(x)]`, which combines both. Data flows down through properties and up through events.

**Q: What is the difference between `[disabled]="x"` and `disabled="x"`?**

A: With brackets Angular evaluates `x` as an expression and sets the DOM property. Without brackets it is a static HTML attribute with the literal string value.

## Done when

- [ ] У твоєму template є interpolation, property binding, class binding та event binding.
- [ ] **Add parcel** блокується на 5, **Reset** працює.
- [ ] Можеш пояснити різницю між `[ ]` і `( )` одним реченням.

---
Docs: [Binding dynamic text, properties and attributes](https://angular.dev/guide/templates/binding) · [Adding event listeners](https://angular.dev/guide/templates/event-listeners)

[← Попередній: Перший компонент](04-first-component.md) · [Наступний: NgModules vs Standalone →](06-ngmodules-vs-standalone.md)
