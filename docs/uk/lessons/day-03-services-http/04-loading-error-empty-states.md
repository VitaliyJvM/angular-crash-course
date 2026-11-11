# Day 3 · Lesson 4 — Loading / error / empty states

[English](../../../en/lessons/day-03-services-http/04-loading-error-empty-states.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 2 · code 4 · try 2 · verify 2

**Learning outcome:** показати в template чотири взаємовиключні стани асинхронних даних — loading, error (з Retry), empty, content.

[← Попередній: HttpClient: GET із JSON fixture](03-httpclient-get-fixture.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Observable basics і безпечні subscriptions: пошук із debounce →](05-observables-and-interop.md)

## Why it matters

Мережа повільна й ненадійна. Екран, що вміє лише «happy path», у production показує порожнє місце або вводить в оману («посилок немає», хоча запит просто впав). Обробка всіх станів — базова вимога code review.

## Concept

Стан уже є в store як три signals: `loading()`, `error()`, `shipments()`. Template лише вибирає одну гілку через `@if / @else if / @else`:

```html
@if (store.loading()) { … } @else if (store.error(); as message) { … } @else { … }
```

- `as message` зберігає результат виразу в локальну змінну template.
- Порядок гілок важливий: спершу loading, потім error, потім empty, і лише тоді контент.
- Accessibility: `role="status"` для індикатора завантаження та `role="alert"` для помилки — screen reader озвучить зміну.

React-паралель: `if (isLoading) return <Spinner/>; if (error) return <Error/>; …` — та сама логіка, але декларативно в template. Це ж саме дають із коробки TanStack Query (`isLoading`, `error`, `data`) та Angular `httpResource` (Lesson 6).

## Follow along

1. Заміни вміст `src/app/features/shipments/shipment-list/shipment-list.html`:

   ```html
   <h2>Shipments</h2>

   @if (store.loading()) {
     <p role="status">Loading shipments…</p>
   } @else if (store.error(); as message) {
     <p class="error" role="alert">{{ message }}</p>
     <button type="button" (click)="store.load()">Retry</button>
   } @else if (store.shipments().length === 0) {
     <p class="muted">No shipments yet.</p>
   } @else {
     <p class="muted">
       Total: {{ counters().total }} · In transit: {{ counters().inTransit }} · Delivered:
       {{ counters().delivered }}
     </p>

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

     <ul class="shipments">
       @for (shipment of filteredShipments(); track shipment.id) {
         <li>
           <app-shipment-card [shipment]="shipment" (delivered)="store.markDelivered($event)" />
         </li>
       } @empty {
         <li class="muted">No shipments match the current filters.</li>
       }
     </ul>
   }
   ```

   Зверни увагу на два різні «порожні» стани: «даних немає взагалі» (`No shipments yet.`) і «фільтр нічого не знайшов» (`@empty`).

2. Побач **loading**: DevTools → Network → throttling «Slow 4G» → онови сторінку. На мить з'явиться `Loading shipments…`. Поверни «No throttling».

3. Побач **error**: у `shipment-api.ts` тимчасово зміни URL на `'data/shipments-missing.json'`. Після перезавантаження сторінки — червоне повідомлення і кнопка Retry (dev server відповідає 404, і це потрапляє в `error` callback). Натисни Retry: у Network з'являється новий запит, бо після помилки `loaded` лишився `false`.

4. Поверни URL `'data/shipments.json'`.

## Try it yourself

Побач третій стан — **empty**, не змінюючи `shipments.json`. Зроби так, щоб застосунок тимчасово отримав порожній масив, і переконайся, що показано `No shipments yet.`, а не лічильники з нулями. Потім поверни все назад.

Hint: у `public/data/` можна покласти ще один файл.

## Verify / Expected result

- Throttling → видно `Loading shipments…`, після завантаження — список.
- Зламаний URL → `Could not load shipments. Please try again.` + Retry; у консолі браузера HTTP-помилка.
- Правильний URL → список, фільтр і «Mark delivered» працюють як раніше.
- Фільтр без збігів показує `No shipments match the current filters.`

## Common mistake / Best practice

**Пастка:** моделювати стан кількома незалежними умовами `@if (loading) … @if (error) … @if (items.length === 0) …`. Під час завантаження масив порожній, тож користувач одночасно бачить «Loading…» і «No shipments yet.».

**Правильно:** один ланцюжок `@if / @else if / @else` із взаємовиключними гілками, а стан помилки обов'язково скидати перед новою спробою (`this._error.set(null)` у `load()`).

## Interview checkpoint

**Q: How do you handle loading and error states for HTTP data in Angular?**

A: I keep the request state next to the data — for example `loading`, `error` and the value as signals in a service, or use `httpResource`, which exposes the same things. The template renders mutually exclusive branches with `@if / @else if`: loading, error with a retry action, empty, and content. Errors are caught in the data layer and turned into a user-friendly message, not left unhandled.

## Done when

- [ ] Template має чотири гілки: loading, error + Retry, empty, content.
- [ ] Ти бачив(-ла) у браузері loading і error стани.
- [ ] URL у `ShipmentApi` знову `'data/shipments.json'`, список відображається.
- [ ] Можеш пояснити різницю між `No shipments yet.` і `@empty`.

---
Docs: [Control flow: @if, @for, @empty](https://angular.dev/guide/templates/control-flow) · [HTTP: handling request failure](https://angular.dev/guide/http/making-requests#handling-request-failure)

[← Попередній: HttpClient: GET із JSON fixture](03-httpclient-get-fixture.md) · [Наступний: Observable basics і безпечні subscriptions: пошук із debounce →](05-observables-and-interop.md)
