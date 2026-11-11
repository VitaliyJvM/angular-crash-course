# Day 2 · Lesson 4 — input(): компонент ShipmentCard

**Estimated time:** 10 хв · **Time budget:** read 2 · code 5 · try 2 · verify 1
**Learning outcome:** виділити presentational-компонент `ShipmentCard` і передати йому дані через `input.required<Shipment>()`.

[← Попередній: computed(): похідний стан і лічильники](03-computed-derived-state.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: output(): подія від child до parent →](05-output-child-to-parent.md)

## Why it matters

Production-код ділять на **container**-компоненти (знають про стан і сервіси) та **presentational** (отримують дані через inputs, нічого не знають про джерело). Малі presentational-компоненти легко перевикористовувати й тестувати — `ShipmentCard` ми протестуємо на Day 5.

## Concept

Signal input — це read-only signal, значення якого задає parent через property binding:

```ts
export class UserBadge {
  readonly name = input.required<string>(); // parent зобов'язаний передати
  readonly size = input(24);                // optional, default 24, тип number виведено
}
```

```html
<app-user-badge [name]="user.name" [size]="32" />
```

- `input.required` без binding у parent → **compile error** (а не `undefined` у runtime).
- Input читають як сигнал: `name()`; на ньому можна будувати `computed`.
- Child **не може** записати в input — потік даних односпрямований (для two-way існує окремий `model()`).
- Щоб parent міг використати `<app-shipment-card>`, клас `ShipmentCard` треба додати в його `imports` — залежності шаблону в standalone-компонентах явні.

| React | Angular | Застереження |
|---|---|---|
| `function Card({ shipment }: Props)` | `shipment = input.required<Shipment>()` | props — аргументи функції; inputs — поля-сигнали класу, доступні й у `computed`, і в шаблоні |
| optional prop + default value | `input(defaultValue)` | — |
| `children` | `<ng-content />` (content projection) | поза цим уроком |

Legacy: `@Input() shipment!: Shipment;` (+ `@Input({ required: true })` з v16). Декоратор-inputs — звичайні поля, реагувати на їх зміну доводилось через `ngOnChanges` або setter.

## Follow along

1. Згенеруй компонент (з каталогу `practice/`):

```bash
npx ng generate component features/shipments/shipment-card --skip-tests
```

З'явилися `shipment-card/shipment-card.ts`, `.html`, `.css`.

2. Заміни `shipment-card/shipment-card.ts`:

```ts
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Shipment } from '../shipment.model';

@Component({
  imports: [DatePipe],
  selector: 'app-shipment-card',
  styleUrl: './shipment-card.css',
  templateUrl: './shipment-card.html',
})
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
}
```

Input — публічний API компонента, тому `readonly` без `protected`. `DatePipe` імпортуємо, бо pipes — теж явні залежності шаблону.

3. Заміни `shipment-card/shipment-card.html`:

```html
<article class="card">
  <div>
    <strong>{{ shipment().trackingNumber }}</strong>
    <span class="muted"> · {{ shipment().carrier }} · {{ shipment().createdAt | date: 'mediumDate' }}</span>
  </div>

  <div class="card-actions">
    <span class="status" [class]="'status-' + shipment().status">{{ shipment().status }}</span>
  </div>
</article>
```

4. Заміни `shipment-card/shipment-card.css` (copy-paste):

```css
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: #eaeef2;
}

.status-IN_TRANSIT {
  background: #ddf4ff;
}

.status-DELIVERED {
  background: #dafbe1;
}
```

Стилі компонента **інкапсульовані**: `.card` тут не зачепить `.card` в інших компонентах.

5. У `shipment-list/shipment-list.ts` додай імпорт і зареєструй компонент:

```ts
import { ShipmentCard } from '../shipment-card/shipment-card';
// ...
  imports: [ShipmentCard],
```

6. У `shipment-list.html` заміни вміст `<li>` усередині `@for`:

```html
    <li>
      <app-shipment-card [shipment]="shipment" />
    </li>
```

7. Браузер: кожна посилка — картка з датою (`Nov 2, 2026`) і кольоровим статус-бейджем.

## Try it yourself

Додай у `ShipmentCard` optional boolean input `compact` (default `false`): коли `true`, картка не показує carrier і дату. Увімкни його з `ShipmentList` для перевірки. Hints: `input(false)`; у parent — `[compact]="true"`. Після перевірки відкоти зміни — фінальна картка завжди повна.

## Verify / Expected result

- 5 карток; бейдж `IN_TRANSIT` блакитний, `DELIVERED` зелений, `CREATED` сірий; фільтри й лічильники працюють.
- Видали `[shipment]="shipment"` з `<app-shipment-card />` → помилка компіляції `Required input 'shipment' from component ShipmentCard must be specified`. Поверни.
- Прибери `ShipmentCard` з `imports` списку → помилка `'app-shipment-card' is not a known element`. Поверни.

## Common mistake / Best practice

**Пастка:** інжектити сервіс зі станом у кожен дрібний компонент («бо так швидше») або мутувати об'єкт, отриманий через input (`this.shipment().status = …`). Компонент стає непридатним для повторного використання й тестів, а мутація змінює дані parent в обхід сигналів — UI не оновиться. **Правильно:** presentational-компонент отримує дані через `input()`, про зміни **просить** parent через `output()` (наступний урок).

## Interview checkpoint

**Q: How do signal inputs differ from the `@Input()` decorator?**
A: `input()` returns a read-only signal, so the value is reactive — you can derive state from it with `computed` instead of using `ngOnChanges` or setters. `input.required` is enforced at compile time and the type is inferred. `@Input()` is the legacy decorator-based API: a plain mutable property with no built-in reactivity.

**Q: What's the difference between a presentational and a container component?**
A: A presentational component only receives data through inputs and emits events through outputs — no services, no knowledge of where data comes from. A container (smart) component injects services, owns state and wires presentational components together.

## Done when

- [ ] `ShipmentCard` існує, має `shipment = input.required<Shipment>()` і не інжектить жодних сервісів.
- [ ] `ShipmentList` імпортує `ShipmentCard` і рендерить `<app-shipment-card [shipment]="shipment" />` у `@for`.
- [ ] Дата відформатована через `DatePipe`, статус має кольоровий бейдж.
- [ ] Бачив(-ла) compile error при пропущеному required input.

---
Docs: [Accepting data with input properties](https://angular.dev/guide/components/inputs) · [Pipes](https://angular.dev/guide/templates/pipes) · [Styling components](https://angular.dev/guide/components/styling)

[← Попередній: computed(): похідний стан і лічильники](03-computed-derived-state.md) · [Наступний: output(): подія від child до parent →](05-output-child-to-parent.md)
