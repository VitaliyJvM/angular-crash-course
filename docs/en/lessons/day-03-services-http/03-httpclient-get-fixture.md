# Day 3 · Lesson 3 — HttpClient: GET from a JSON fixture

**English** | [Українська](../../../uk/lessons/day-03-services-http/03-httpclient-get-fixture.md)

**Estimated time:** 15 min · **Time budget:** read 3 · code 8 · try 2 · verify 2

**Learning outcome:** load a typed list of shipments through `HttpClient` from a local JSON file and separate data access (`ShipmentApi`) from state (`ShipmentStore`).

[← Previous: DI: provider scopes and comparison with Spring](02-di-scopes-vs-spring.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Loading / error / empty states →](04-loading-error-empty-states.md)

## Why it matters

Almost every Angular application is a client of a REST API. The standard path: a thin API service knows about URLs and HTTP, the store holds the state, the component only renders.

## Concept

`HttpClient` returns an **Observable**, not a Promise:

```ts
this.http.get<Shipment[]>('data/shipments.json'); // Observable<Shipment[]>, the request has NOT been sent yet
```

- An Observable is **lazy**: the request goes out only after `subscribe()` (unlike `fetch()`/Promise, which starts immediately).
- The generic `get<T>` is a compile-time **assertion**, not runtime validation: Angular does not check the shape of the JSON.
- In Angular 22 `HttpClient` is available without any setup: the generated `app.config.ts` has no `provideHttpClient()`. You need it only for configuration, e.g. `provideHttpClient(withInterceptors([authInterceptor]))`. In projects ≤ v20 it is always there — you need to know this for legacy code.

Mapping: `ShipmentApi` ≈ a Spring `RestClient`/Feign client or a React `api.ts` module with `fetch`; interceptors ≈ Spring `ClientHttpRequestInterceptor` / axios interceptors.

**Being honest about the fixture.** `public/data/shipments.json` is a static file that the dev server serves as is. `GET` works; `POST`/`PUT`/`DELETE` would not save anything — there is no backend. All changes (`markDelivered`, and on Day 4 adding as well) live in memory and disappear after a reload.

**The course's trade-off.** Angular 22 has a stable `httpResource` (signal-based GET, see Lesson 6). We go with `HttpClient` + a store with a writable signal because (1) we need in-memory changes on top of the loaded data, and (2) `HttpClient` + Observable is what you find in enterprise code and what interviewers ask about.

## Follow along

1. Copy the fixture from the reference application (do not type it by hand), from the `practice/` folder:

   ```bash
   mkdir -p public/data && cp ../app/public/data/shipments.json public/data/
   ```

   One element of the array looks like this:

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

2. In `src/app/features/shipments/shipment.model.ts` add `TrackingEvent` and the `events` field (you will need it on Day 4):

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

3. Generate the API service and replace its contents:

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

   The URL is relative — it is resolved against `<base href="/">` in `index.html`.

4. Replace `shipment-store.ts` — the store now starts empty and knows how to `load()`:

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

   The `loaded` guard is needed so that a repeated `load()` (after returning to the list on Day 4) does not wipe out the in-memory changes. After an error `loaded` stays `false`, so a retry is possible.

5. Delete the mock:

   ```bash
   rm src/app/features/shipments/shipment.mock.ts
   ```

   Then trigger the load from the component. In `shipment-list/shipment-list.ts` add to the end of the class:

   ```ts
   constructor() {
     this.store.load();
   }
   ```

   `loading` and `error` are not shown anywhere yet — that is the next lesson.

## Try it yourself

In your `public/data/shipments.json` temporarily change one `status` to `"LOST"` (there is no such value in `ShipmentStatus`). Will the build fail? Will an error appear at runtime? What will you see in the UI? Put into words what this implies about `get<Shipment[]>`, and change the value back.

Hint: compare what TypeScript knows at compile time with when the JSON arrives.

## Verify / Expected result

- http://localhost:4200 shows the same 5 shipments, but now DevTools → Network has a `shipments.json` request with status 200.
- http://localhost:4200/data/shipments.json opens the raw JSON.
- Click "Mark delivered", refresh the page — the status is back: the changes are in memory only.
- `shipment.mock.ts` is deleted, `npx ng build` passes.

## Common mistake / Best practice

**Pitfall:** injecting `HttpClient` straight into a component and keeping the URL and `subscribe` there. The result: the component is hard to test, URLs are scattered across the UI, and every screen duplicates the same logic.

**Do this instead:** HTTP only in the API service (`ShipmentApi`), state in the store, and the component calls `store.load()` and reads signals. It is the same separation as controller → service → repository in Spring.

## Interview checkpoint

**Q: What does `HttpClient.get<T>()` return and when is the request sent?**

A: It returns a cold Observable of `T`. Nothing is sent until something subscribes, and each subscription triggers a new request. The observable emits the parsed body once and completes. The generic type is only a compile-time assertion — the response is not validated at runtime.

**Q: Do you need `provideHttpClient()`?**

A: In current Angular, HttpClient works out of the box, so you only call `provideHttpClient()` to configure features such as interceptors or XSRF. In older projects it is always present in the app config, and before standalone it was `HttpClientModule`.

## Done when

- [ ] The data comes from `public/data/shipments.json`, and Network shows a single GET.
- [ ] `ShipmentApi` has no state, `ShipmentStore` does not know the URL.
- [ ] `shipment.mock.ts` is deleted and the application builds.
- [ ] You can explain why the changes disappear after a reload and why a POST to the fixture is impossible.

---
Docs: [HttpClient overview](https://angular.dev/guide/http) · [Making requests](https://angular.dev/guide/http/making-requests) · [Setting up HttpClient](https://angular.dev/guide/http/setup)

[← Previous: DI: provider scopes and comparison with Spring](02-di-scopes-vs-spring.md) · [Next: Loading / error / empty states →](04-loading-error-empty-states.md)
