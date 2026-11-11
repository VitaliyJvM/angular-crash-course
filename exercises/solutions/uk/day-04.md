# Day 4 — Solutions (Try it yourself)

[English](../en/day-04.md) | **Українська**

> ⚠️ Не читай наперед. Відкривай розділ лише після власної спроби виконати завдання відповідного уроку.
> Ці розв'язки **не входять** до еталонного `app/` — це невеликі додаткові вправи.

## Lesson 1 — сторінка `/about`

```bash
npx ng generate component features/about --inline-template --inline-style --skip-tests
```

`src/app/app.routes.ts` — новий запис **перед** wildcard:

```ts
import { About } from './features/about/about';
// ...
{ path: 'about', component: About, title: 'About · ParcelFlow Lite' },
{ path: '**', redirectTo: 'shipments' },
```

`src/app/app.html` — у `nav`:

```html
<a routerLink="/about" routerLinkActive="active" ariaCurrentWhenActive="page">About</a>
```

Якщо поставити route після `'**'`, він ніколи не спрацює: wildcard матчить будь-який URL першим.

## Lesson 2 — посилання «Next shipment →»

`shipment-details.ts`:

```ts
protected readonly nextShipment = computed(() =>
  this.store.shipments().find((s) => s.id === Number(this.id()) + 1),
);
```

`shipment-details.html` (усередині гілки `@else if (shipment(); as shipment)`):

```html
@if (nextShipment(); as next) {
  <p><a [routerLink]="['/shipments', next.id]">Next shipment →</a></p>
}
```

Що спостерігати: при переході `/shipments/1` → `/shipments/2` Router перевикористовує той самий instance `ShipmentDetails`; змінюється лише input `id`, а обидва `computed` перераховуються. Із `ActivatedRoute.snapshot` сторінка залишилася б на старих даних.

## Lesson 3 — live preview моделі та Reset

`shipment-form.ts`:

```ts
import { JsonPipe } from '@angular/common';
// ...
imports: [FormField, FormRoot, RouterLink, JsonPipe],
// ...
protected reset(): void {
  this.model.set({ trackingNumber: '', carrier: '' });
}
```

`shipment-form.html`:

```html
<!-- у .actions -->
<button type="button" (click)="reset()">Reset</button>

<!-- під формою -->
<pre>{{ model() | json }}</pre>
```

Ввід у поле одразу змінює `model()`, а `model.set(...)` одразу очищає inputs: форма не має власної копії даних.

## Lesson 4 — зарезервований номер `PF-0000`

У schema-функції `shipment-form.ts`:

```ts
validate(path.trackingNumber, ({ value }) =>
  value() === 'PF-0000'
    ? { kind: 'reserved', message: 'PF-0000 is reserved and cannot be used.' }
    : null,
);
```

Template змінювати не потрібно: `@for` по `errors()` покаже нову помилку автоматично. Саме тому повідомлення зручно тримати поруч із правилом, а не в template.

## Lesson 5 — live preview через `valueChanges`

`shipment-form-reactive.ts`:

```ts
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
// ...
imports: [ReactiveFormsModule, JsonPipe],
// ...
// оголосити ПІСЛЯ поля form
protected readonly value = toSignal(this.form.valueChanges, {
  initialValue: this.form.getRawValue(),
});
```

У template під формою:

```html
<pre>{{ value() | json }}</pre>
```

`valueChanges` — «вічний» Observable (не завершується сам), тому ручний `subscribe()` без відписки дав би memory leak; `toSignal` відписується при знищенні компонента.
