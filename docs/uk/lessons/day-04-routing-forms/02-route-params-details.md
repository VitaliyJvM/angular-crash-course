# Day 4 · Lesson 2 — Route parameters: сторінка ShipmentDetails

[English](../../../en/lessons/day-04-routing-forms/02-route-params-details.md) | **Українська**

**Estimated time:** 15 хв · **Time budget:** read 3 · code 8 · try 3 · verify 1

**Learning outcome:** сторінка `/shipments/:id` показує деталі посилки; route parameter потрапляє в компонент як signal input, а стани loading / error / not found оброблені.

[← Попередній: Routes та навігація](01-routes-and-navigation.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Signal Forms: форма створення посилки →](03-signal-forms-basics.md)

## Why it matters

Master–detail (список → сторінка сутності) — найтиповіший сценарій у бізнес-застосунках. Сторінка деталей мусить працювати і при переході зі списку, і при прямому відкритті URL або reload — це часта причина багів.

## Concept

Сегмент `:id` у `path` — route parameter. Є два способи прочитати його в компоненті.

**Сучасний (використовуємо):** `withComponentInputBinding()` — Router сам прив'язує path params, query params і route `data` до inputs компонента з тим самим ім'ям:

```ts
// route: { path: 'shipments/:id', component: ShipmentDetails }
readonly id = input.required<string>(); // значення з URL, завжди string
```

**Класичний (побачиш у legacy-коді та на співбесідах):** `ActivatedRoute`:

```ts
private readonly route = inject(ActivatedRoute);
readonly id = this.route.snapshot.paramMap.get('id');            // разове читання
readonly id$ = this.route.paramMap.pipe(map((p) => p.get('id'))); // Observable, реагує на зміну
```

`snapshot` не оновлюється, якщо Router перевикористовує той самий компонент при переході `/shipments/1` → `/shipments/2`; signal input оновлюється автоматично, тому `computed()` від нього завжди актуальний.

React-паралель: `const { id } = useParams()` ≈ `id = input.required<string>()`. Застереження: в Angular це звичайний input компонента, тому той самий компонент можна використати й без Router (наприклад, у тесті через `setInput`).

Guards і resolvers (захист маршрутів, попереднє завантаження даних) — **Optional / Outside 5-hour course**.

## Follow along

1. Згенеруй компонент:

   ```bash
   npx ng generate component features/shipments/shipment-details --skip-tests
   ```

   Стилі цьому компоненту не потрібні: видали `shipment-details.css` і рядок `styleUrl` (або залиш порожній файл — це не помилка).

2. Заміни `src/app/features/shipments/shipment-details/shipment-details.ts`:

   ```ts
   import { DatePipe } from '@angular/common';
   import { Component, computed, inject, input } from '@angular/core';
   import { RouterLink } from '@angular/router';
   import { ShipmentStore } from '../shipment-store';

   @Component({
     imports: [DatePipe, RouterLink],
     selector: 'app-shipment-details',
     templateUrl: './shipment-details.html',
   })
   export class ShipmentDetails {
     protected readonly store = inject(ShipmentStore);

     /** Bound from the ':id' route parameter by withComponentInputBinding(). Always a string. */
     readonly id = input.required<string>();

     protected readonly shipment = computed(() =>
       this.store.shipments().find((s) => s.id === Number(this.id())),
     );

     constructor() {
       this.store.load(); // makes a direct link / page reload on /shipments/:id work
     }
   }
   ```

   Компонент не тримає власної копії посилки: `shipment` — derived state від store та `id`.

3. Заміни `shipment-details.html`:

   ```html
   <p><a routerLink="/shipments">← Back to shipments</a></p>

   @if (store.loading()) {
     <p role="status">Loading shipment…</p>
   } @else if (store.error(); as message) {
     <p class="error" role="alert">{{ message }}</p>
   } @else if (shipment(); as shipment) {
     <h2>{{ shipment.trackingNumber }}</h2>

     <dl>
       <dt>Carrier</dt>
       <dd>{{ shipment.carrier }}</dd>
       <dt>Status</dt>
       <dd>{{ shipment.status }}</dd>
       <dt>Created</dt>
       <dd>{{ shipment.createdAt | date: 'medium' }}</dd>
     </dl>

     @if (shipment.status !== 'DELIVERED') {
       <button type="button" (click)="store.markDelivered(shipment.id)">Mark delivered</button>
     }

     <h3>Tracking events</h3>
     <ol>
       @for (event of shipment.events ?? []; track event.timestamp) {
         <li>
           {{ event.timestamp | date: 'short' }} · {{ event.location }} — {{ event.description }}
         </li>
       } @empty {
         <li class="muted">No tracking events yet.</li>
       }
     </ol>
   } @else {
     <p class="error" role="alert">Shipment #{{ id() }} not found.</p>
   }
   ```

   `@if (shipment(); as shipment)` — читає signal один раз і звужує тип до `Shipment` (без `undefined`) усередині блоку.

4. Додай route у `src/app/app.routes.ts` **перед** wildcard:

   ```ts
   import { ShipmentDetails } from './features/shipments/shipment-details/shipment-details';
   // ...
   { path: 'shipments/:id', component: ShipmentDetails, title: 'Shipment details · ParcelFlow Lite' },
   { path: '**', redirectTo: 'shipments' },
   ```

5. Увімкни input binding у `src/app/app.config.ts`:

   ```ts
   import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
   import { provideRouter, withComponentInputBinding } from '@angular/router';
   import { routes } from './app.routes';

   export const appConfig: ApplicationConfig = {
     providers: [
       provideBrowserGlobalErrorListeners(),
       // withComponentInputBinding(): route params (e.g. :id) are bound to component inputs.
       provideRouter(routes, withComponentInputBinding()),
     ],
   };
   ```

6. Зроби tracking number у картці посиланням. У `shipment-card/shipment-card.ts`:

   ```ts
   import { RouterLink } from '@angular/router';
   // ...
   imports: [DatePipe, RouterLink],
   ```

   У `shipment-card/shipment-card.html` заміни `<strong>{{ shipment().trackingNumber }}</strong>` на:

   ```html
   <a [routerLink]="['/shipments', shipment().id]">
     <strong>{{ shipment().trackingNumber }}</strong>
   </a>
   ```

   Масив у `[routerLink]` — це сегменти URL; Router сам збере `/shipments/1`.

## Try it yourself

Додай на сторінку деталей посилання **«Next shipment →»**, яке веде на посилку з наступним `id` і показується лише тоді, коли така посилка існує.

- Hint 1: ще один `computed()`, що шукає в `store.shipments()` посилку з `Number(id()) + 1`.
- Hint 2: зверни увагу, що при переході компонент не створюється заново — змінюється лише input `id`.

## Verify / Expected result

- Клік на `PF-1001` у списку відкриває `/shipments/1` з трьома tracking events.
- Reload на `/shipments/1` — сторінка завантажується (спершу коротко `Loading shipment…`).
- `/shipments/999` показує `Shipment #999 not found.`
- `Mark delivered` на деталях ховає кнопку; після `← Back to shipments` статус і лічильники у списку оновлені (спільний `ShipmentStore`).

## Common mistake / Best practice

**Пастка:** забути `withComponentInputBinding()`. Наслідок: runtime error `NG0950: Input "id" is required but no value is available yet` — код компілюється, але сторінка деталей падає. **Правильно:** увімкнути feature в `provideRouter(...)`; і пам'ятати, що route param — завжди `string`, тому перед порівнянням з числовим `id` потрібен `Number(...)`.

## Interview checkpoint

**Q: How do you read a route parameter in a component?**

A: The modern way is to enable `withComponentInputBinding()` and declare an input with the same name as the parameter, so the router binds it and it stays reactive. The classic way is injecting `ActivatedRoute` and reading `snapshot.paramMap` for a one-off value, or subscribing to the `paramMap` observable when the same component instance can be reused for different parameters.

**Q: Why can `ActivatedRoute.snapshot` be a problem?**

A: The snapshot is read once. If the router reuses the component for a new parameter value, the snapshot-based code keeps showing stale data, so you need the observable or a signal input instead.

## Done when

- [ ] `/shipments/:id` відкривається і зі списку, і прямим URL/reload.
- [ ] `ShipmentDetails` отримує `id` через `input.required<string>()`, без `ActivatedRoute`.
- [ ] Оброблені стани loading, error і not found.
- [ ] Зміна статусу на сторінці деталей видна у списку.

---
Docs: [Read route state](https://angular.dev/guide/routing/read-route-state) · [withComponentInputBinding](https://angular.dev/api/router/withComponentInputBinding) · [Define routes](https://angular.dev/guide/routing/define-routes)

[← Попередній: Routes та навігація](01-routes-and-navigation.md) · [Наступний: Signal Forms: форма створення посилки →](03-signal-forms-basics.md)
