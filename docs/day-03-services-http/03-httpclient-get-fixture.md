# Day 3 · Lesson 3 — HttpClient: GET із JSON fixture

**Estimated time:** 15 хв · **Time budget:** read 3 · code 8 · try 2 · verify 2
**Learning outcome:** завантажити типізований список посилок через `HttpClient` із локального JSON і розділити data access (`ShipmentApi`) та state (`ShipmentStore`).

[← Попередній: DI: provider scopes і порівняння зі Spring](02-di-scopes-vs-spring.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Loading / error / empty states →](04-loading-error-empty-states.md)

## Why it matters

Майже кожен Angular-застосунок — клієнт до REST API. Стандартний шлях: тонкий API-service знає про URL і HTTP, store тримає стан, компонент лише відображає.

## Concept

`HttpClient` повертає **Observable**, а не Promise:

```ts
this.http.get<Shipment[]>('data/shipments.json'); // Observable<Shipment[]>, запит ще НЕ відправлено
```

- Observable **lazy**: запит іде лише після `subscribe()` (на відміну від `fetch()`/Promise, що стартує одразу).
- Generic `get<T>` — це compile-time **твердження**, не runtime-валідація: Angular не перевіряє форму JSON.
- В Angular 22 `HttpClient` доступний без налаштувань: у згенерованому `app.config.ts` немає `provideHttpClient()`. Він потрібен лише для конфігурації, напр. `provideHttpClient(withInterceptors([authInterceptor]))`. У проєктах ≤ v20 він є завжди — це треба знати для legacy-коду.

Mapping: `ShipmentApi` ≈ Spring `RestClient`/Feign client або React-модуль `api.ts` із `fetch`; interceptors ≈ Spring `ClientHttpRequestInterceptor` / axios interceptors.

**Чесно про fixture.** `public/data/shipments.json` — статичний файл, який dev server віддає як є. `GET` працює; `POST`/`PUT`/`DELETE` нічого б не зберегли — backend немає. Усі зміни (`markDelivered`, а на Day 4 і додавання) живуть у пам'яті й зникають після reload.

**Компроміс курсу.** В Angular 22 є stable `httpResource` (signal-based GET, див. Lesson 6). Ми беремо `HttpClient` + store з writable signal, бо (1) поверх завантажених даних потрібні in-memory зміни, (2) `HttpClient` + Observable — це те, що є в enterprise-коді та про що питають на співбесідах.

## Follow along

1. Скопіюй fixture з еталонного застосунку (не набирай вручну), з папки `practice/`:

   ```bash
   mkdir -p public/data && cp ../app/public/data/shipments.json public/data/
   ```

   Один елемент масиву виглядає так:

   ```json
   {
     "id": 3,
     "trackingNumber": "PF-1003",
     "carrier": "Ukrposhta",
     "status": "CREATED",
     "createdAt": "2026-11-08T08:05:00Z",
     "events": [
       { "timestamp": "2026-11-08T08:05:00Z", "location": "Odesa", "description": "Shipment created" }
     ]
   }
   ```

2. У `src/app/features/shipments/shipment.model.ts` додай `TrackingEvent` і поле `events` (знадобиться на Day 4):

   ```ts
   export interface TrackingEvent {
     timestamp: string; // ISO 8601
     location: string;
     description: string;
   }

   export interface Shipment {
     id: number;
     trackingNumber: string;
     carrier: string;
     status: ShipmentStatus;
     createdAt: string; // ISO 8601, as it would arrive from a REST API
     events?: TrackingEvent[];
   }
   ```

3. Згенеруй API-service і заміни його вміст:

   ```bash
   npx ng generate service features/shipments/shipment-api --skip-tests
   ```

   ```ts
   // src/app/features/shipments/shipment-api.ts
   import { HttpClient } from '@angular/common/http';
   import { inject, Service } from '@angular/core';
   import { Observable } from 'rxjs';
   import { Shipment } from './shipment.model';

   /** Data access only: knows URLs and HTTP, holds no state. */
   @Service()
   export class ShipmentApi {
     private readonly http = inject(HttpClient);

     getAll(): Observable<Shipment[]> {
       // Static fixture served from public/. GET works; POST/PUT/DELETE would not persist anything.
       return this.http.get<Shipment[]>('data/shipments.json');
     }
   }
   ```

   URL відносний — резолвиться від `<base href="/">` в `index.html`.

4. Заміни `shipment-store.ts` — store тепер стартує порожнім і вміє `load()`:

   ```ts
   import { inject, Service, signal } from '@angular/core';
   import { ShipmentApi } from './shipment-api';
   import { Shipment } from './shipment.model';

   /** Feature state: a single source of truth for shipments, exposed as read-only signals. */
   @Service()
   export class ShipmentStore {
     private readonly api = inject(ShipmentApi);

     private readonly _shipments = signal<Shipment[]>([]);
     private readonly _loading = signal(false);
     private readonly _error = signal<string | null>(null);
     private loaded = false;

     readonly shipments = this._shipments.asReadonly();
     readonly loading = this._loading.asReadonly();
     readonly error = this._error.asReadonly();

     /** Loads the fixture once; later calls are no-ops so in-memory changes are not overwritten. */
     load(): void {
       if (this.loaded || this._loading()) {
         return;
       }
       this._loading.set(true);
       this._error.set(null);

       // HttpClient observables emit once and complete, so this subscription cleans itself up.
       this.api.getAll().subscribe({
         next: (shipments) => {
           this._shipments.set(shipments);
           this.loaded = true;
           this._loading.set(false);
         },
         error: () => {
           this._error.set('Could not load shipments. Please try again.');
           this._loading.set(false);
         },
       });
     }

     markDelivered(id: number): void {
       this._shipments.update((shipments) =>
         shipments.map((s) => (s.id === id ? { ...s, status: 'DELIVERED' } : s)),
       );
     }
   }
   ```

   Guard `loaded` потрібен, щоб повторний `load()` (після повернення на список на Day 4) не затер in-memory зміни. Після помилки `loaded` лишається `false`, тож retry можливий.

5. Видали mock і запусти завантаження з компонента. У `shipment-list/shipment-list.ts` додай у кінець класу:

   ```bash
   rm src/app/features/shipments/shipment.mock.ts
   ```

   ```ts
   constructor() {
     this.store.load();
   }
   ```

   `loading` та `error` поки ніде не показуються — це наступний урок.

## Try it yourself

У своєму `public/data/shipments.json` тимчасово зміни один `status` на `"LOST"` (такого значення в `ShipmentStatus` немає). Чи впаде збірка? Чи з'явиться помилка в runtime? Що побачиш у UI? Сформулюй, що з цього випливає про `get<Shipment[]>`, і поверни значення назад.

Hint: порівняй, що знає TypeScript на етапі компіляції, і коли приходить JSON.

## Verify / Expected result

- http://localhost:4200 показує ті самі 5 посилок, але тепер у DevTools → Network є запит `shipments.json` зі статусом 200.
- http://localhost:4200/data/shipments.json відкриває сирий JSON.
- Натисни «Mark delivered», онови сторінку — статус повернувся: зміни лише в пам'яті.
- `shipment.mock.ts` видалено, `npx ng build` проходить.

## Common mistake / Best practice

**Пастка:** інжектити `HttpClient` прямо в компонент і тримати там URL та `subscribe`. Наслідок: компонент важко тестувати, URL розкидані по UI, ту саму логіку дублює кожен екран.
**Правильно:** HTTP — тільки в API-service (`ShipmentApi`), стан — у store, компонент викликає `store.load()` і читає signals. Це той самий поділ, що controller → service → repository у Spring.

## Interview checkpoint

**Q: What does `HttpClient.get<T>()` return and when is the request sent?**
A: It returns a cold Observable of `T`. Nothing is sent until something subscribes, and each subscription triggers a new request. The observable emits the parsed body once and completes. The generic type is only a compile-time assertion — the response is not validated at runtime.

**Q: Do you need `provideHttpClient()`?**
A: In current Angular, HttpClient works out of the box, so you only call `provideHttpClient()` to configure features such as interceptors or XSRF. In older projects it is always present in the app config, and before standalone it was `HttpClientModule`.

## Done when

- [ ] Дані приходять із `public/data/shipments.json`, у Network видно один GET.
- [ ] `ShipmentApi` не має стану, `ShipmentStore` не знає URL.
- [ ] `shipment.mock.ts` видалено, застосунок збирається.
- [ ] Можеш пояснити, чому зміни зникають після reload і чому POST у fixture неможливий.

---
Docs: [HttpClient overview](https://angular.dev/guide/http) · [Making requests](https://angular.dev/guide/http/making-requests) · [Setting up HttpClient](https://angular.dev/guide/http/setup)
[← Попередній: DI: provider scopes і порівняння зі Spring](02-di-scopes-vs-spring.md) · [Наступний: Loading / error / empty states →](04-loading-error-empty-states.md)
