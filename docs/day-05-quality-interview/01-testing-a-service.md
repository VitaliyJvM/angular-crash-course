# Day 5 · Lesson 1 — Unit test сервісу: ShipmentStore

**Estimated time:** 10 хв · **Time budget:** read 2 · code 4 · try 3 · verify 1
**Learning outcome:** написати unit test для `ShipmentStore`, який підміняє HTTP через `HttpTestingController` і перевіряє signals `loading` / `shipments`.

[← Попередній: Signal Forms vs Reactive Forms vs template-driven](../day-04-routing-forms/05-forms-comparison-reactive.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Unit test компонента: ShipmentCard →](02-testing-a-component.md)

## Why it matters

Сервіси зі станом і HTTP — найдешевше місце для тестів: без DOM, швидко, і саме тут живе логіка (loading/error, in-memory add). На співбесіді майже завжди питають, як замокати `HttpClient`.

## Concept

- **Runner.** Angular CLI 22 за замовчуванням використовує **Vitest** + **jsdom** через builder `@angular/build:unit-test` (див. `angular.json` → `test`). `describe / it / expect / vi` — глобальні; їхні типи підключає `"types": ["vitest/globals"]` у `tsconfig.spec.json`.
- **Команди.** `npx ng test` — watch mode; `npx ng test --no-watch --no-progress` — один прогін (CI).
- **TestBed** — тестовий DI-контейнер. Найближча аналогія зі Spring: легкий `ApplicationContext` у тесті (`@SpringBootTest` slice), де можна підмінити providers. Аналогія неповна: TestBed створюється наново для кожного тесту й нічого не сканує.
- **HTTP.** `provideHttpClientTesting()` підміняє HTTP backend; `HttpTestingController` дає змогу знайти запит (`expectOne(url)`) і відповісти на нього (`flush(body)`). Запит «висить», доки ви не викличете `flush` — тому проміжний стан `loading === true` перевіряється синхронно, без таймерів.
- **v22 vs старіший код.** У v22 `HttpClient` доступний за замовчуванням, тому достатньо `provideHttpClientTesting()`. У старішому коді побачите `providers: [provideHttpClient(), provideHttpClientTesting()]`.
- **Legacy (лише впізнавати):** Karma + Jasmine, `HttpClientTestingModule` (deprecated), `fakeAsync`/`tick`.

React-паралель: Vitest/Jest + MSW або мок `fetch`; в Angular мок HTTP — частина фреймворку.

## Follow along

1. Створіть `src/app/features/shipments/shipment-store.spec.ts`:

   ```ts
   import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
   import { TestBed } from '@angular/core/testing';
   import { ShipmentStore } from './shipment-store';
   import { Shipment } from './shipment.model';

   const SHIPMENTS: Shipment[] = [
     { id: 1, trackingNumber: 'PF-1001', carrier: 'DHL', status: 'IN_TRANSIT', createdAt: '2026-11-02T09:15:00Z' },
     { id: 2, trackingNumber: 'PF-1002', carrier: 'Ukrposhta', status: 'DELIVERED', createdAt: '2026-10-28T14:40:00Z' },
   ];

   describe('ShipmentStore', () => {
     let store: ShipmentStore;
     let http: HttpTestingController;

     beforeEach(() => {
       TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
       store = TestBed.inject(ShipmentStore);
       http = TestBed.inject(HttpTestingController);
     });

     afterEach(() => http.verify()); // fails the test if a request was left unanswered

     it('loads shipments and toggles the loading flag', () => {
       store.load();
       expect(store.loading()).toBe(true);

       http.expectOne('data/shipments.json').flush(SHIPMENTS);

       expect(store.loading()).toBe(false);
       expect(store.error()).toBeNull();
       expect(store.shipments()).toEqual(SHIPMENTS);
     });
   });
   ```

2. Запустіть один прогін:

   ```bash
   npx ng test --no-watch --no-progress
   ```

3. Прочитайте тест як Arrange / Act / Assert: `store.load()` → запит у черзі (`loading` = `true`) → `flush` → signals оновлені. Жодного `await`: `flush` доставляє відповідь синхронно, а signals читаються як звичайні функції.

4. Тимчасово змініть URL у `expectOne` на `'data/other.json'`, перезапустіть і подивіться на помилку (`Expected one matching request…`). Поверніть правильний URL.

## Try it yourself

Додайте у той самий `describe` ще два тести (без підглядання в `app/`):

1. **Error path:** запит завершується `404` → `loading()` = `false`, `error()` містить `'Could not load shipments'`, `shipments()` — порожній масив.
2. **`add()`:** після успішного `load` виклик `store.add({ trackingNumber: 'PF-2000', carrier: 'DHL' })` повертає shipment з `id` = 3 і статусом `CREATED`; у store стає 3 записи.

Hints:

- Помилкова відповідь — це теж `flush`, але з другим аргументом `{ status, statusText }`.
- Для довжини масиву є matcher `toHaveLength`.

## Verify / Expected result

```bash
npx ng test --no-watch --no-progress
```

- У підсумку Vitest `shipment-store.spec.ts` має 3 зелені тести, `failed` — 0.
- Еталон для порівняння **після** власної спроби: `../app/src/app/features/shipments/shipment-store.spec.ts`.

## Common mistake / Best practice

**Пастка:** забути `afterEach(() => http.verify())`. Наслідок: тест проходить, навіть якщо код зробив зайвий або неочікуваний запит (наприклад, `load()` перестав бути ідемпотентним і викликав API двічі). **Правильно:** завжди `verify()` в `afterEach` і перевірка через публічний API сервісу (`store.shipments()`), а не через приватні поля (`_shipments`).

## Interview checkpoint

**Q: How do you unit test a service that uses HttpClient?**
A: I configure TestBed with `provideHttpClientTesting()`, inject the service and `HttpTestingController`, trigger the call, then use `expectOne(url).flush(data)` to answer the request and assert on the result. In `afterEach` I call `verify()` to make sure there are no unexpected requests.

**Q: What is the default test setup in a new Angular project?**
A: Since recent versions the CLI uses Vitest running in Node with jsdom, through the `unit-test` builder. Karma and Jasmine are legacy; browser mode is opt-in.

## Done when

- [ ] `shipment-store.spec.ts` існує у вашому `practice/` і містить тест `loads shipments and toggles the loading flag`.
- [ ] Ви самостійно додали тести на error path і `add()`.
- [ ] `npx ng test --no-watch --no-progress` завершується без failed tests.
- [ ] Можете пояснити, навіщо `http.verify()` і чому в тесті немає `await`.

---

Docs: [Testing overview](https://angular.dev/guide/testing) · [Testing services](https://angular.dev/guide/testing/services) · [HTTP testing](https://angular.dev/guide/http/testing)

[← Попередній: Signal Forms vs Reactive Forms vs template-driven](../day-04-routing-forms/05-forms-comparison-reactive.md) · [Наступний: Unit test компонента: ShipmentCard →](02-testing-a-component.md)
