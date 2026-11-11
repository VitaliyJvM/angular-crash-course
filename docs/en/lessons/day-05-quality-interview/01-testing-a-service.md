# Day 5 · Lesson 1 — Unit testing a service: ShipmentStore

**English** | [Українська](../../../uk/lessons/day-05-quality-interview/01-testing-a-service.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 4 · try 3 · verify 1

**Learning outcome:** write a unit test for `ShipmentStore` that replaces HTTP with `HttpTestingController` and checks the `loading` / `shipments` signals.

[← Previous: Signal Forms vs Reactive Forms vs template-driven](../day-04-routing-forms/05-forms-comparison-reactive.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Unit testing a component: ShipmentCard →](02-testing-a-component.md)

## Why it matters

Services with state and HTTP are the cheapest place for tests: no DOM, fast, and this is exactly where the logic lives (loading/error, in-memory add). In interviews you are almost always asked how to mock `HttpClient`.

## Concept

- **Runner.** Angular CLI 22 uses **Vitest** + **jsdom** by default through the `@angular/build:unit-test` builder (see `angular.json` → `test`). `describe / it / expect / vi` are globals; their types are pulled in by `"types": ["vitest/globals"]` in `tsconfig.spec.json`.
- **Commands.** `npx ng test` — watch mode; `npx ng test --no-watch --no-progress` — a single run (CI).
- **TestBed** is the test DI container. The closest Spring analogy: a lightweight `ApplicationContext` in a test (a `@SpringBootTest` slice) where you can replace providers. The analogy is incomplete: TestBed is created from scratch for every test and scans nothing.
- **HTTP.** `provideHttpClientTesting()` replaces the HTTP backend; `HttpTestingController` lets you find a request (`expectOne(url)`) and respond to it (`flush(body)`). The request stays pending until you call `flush` — which is why the intermediate state `loading === true` is checked synchronously, without timers.
- **v22 vs older code.** In v22 `HttpClient` is available by default, so `provideHttpClientTesting()` is enough. In older code you will see `providers: [provideHttpClient(), provideHttpClientTesting()]`.
- **Legacy (recognize only):** Karma + Jasmine, `HttpClientTestingModule` (deprecated), `fakeAsync`/`tick`.

React parallel: Vitest/Jest + MSW or a `fetch` mock; in Angular the HTTP mock is part of the framework.

## Follow along

1. Create `src/app/features/shipments/shipment-store.spec.ts`:

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

2. Run a single pass:

   ```bash
   npx ng test --no-watch --no-progress
   ```

3. Read the test as Arrange / Act / Assert: `store.load()` → the request is queued (`loading` = `true`) → `flush` → the signals are updated. Not a single `await`: `flush` delivers the response synchronously, and signals are read like ordinary functions.

4. Temporarily change the URL in `expectOne` to `'data/other.json'`, rerun and look at the error (`Expected one matching request…`). Restore the correct URL.

## Try it yourself

Add two more tests to the same `describe` (without peeking into `app/`):

1. **Error path:** the request fails with `404` → `loading()` = `false`, `error()` contains `'Could not load shipments'`, `shipments()` is an empty array.
2. **`add()`:** after a successful `load`, calling `store.add({ trackingNumber: 'PF-2000', carrier: 'DHL' })` returns a shipment with `id` = 3 and status `CREATED`; the store now holds 3 entries.

Hints:

- An error response is also a `flush`, but with a second argument `{ status, statusText }`.
- For array length there is the `toHaveLength` matcher.

## Verify / Expected result

```bash
npx ng test --no-watch --no-progress
```

- In the Vitest summary `shipment-store.spec.ts` has 3 green tests, `failed` is 0.
- Reference to compare against **after** your own attempt: `../app/src/app/features/shipments/shipment-store.spec.ts`.

## Common mistake / Best practice

**Pitfall:** forgetting `afterEach(() => http.verify())`. Consequence: the test passes even if the code made an extra or unexpected request (for example, `load()` stopped being idempotent and called the API twice). **Correct:** always call `verify()` in `afterEach` and assert through the service's public API (`store.shipments()`), not through private fields (`_shipments`).

## Interview checkpoint

**Q: How do you unit test a service that uses HttpClient?**

A: I configure TestBed with `provideHttpClientTesting()`, inject the service and `HttpTestingController`, trigger the call, then use `expectOne(url).flush(data)` to answer the request and assert on the result. In `afterEach` I call `verify()` to make sure there are no unexpected requests.

**Q: What is the default test setup in a new Angular project?**

A: Since recent versions the CLI uses Vitest running in Node with jsdom, through the `unit-test` builder. Karma and Jasmine are legacy; browser mode is opt-in.

## Done when

- [ ] `shipment-store.spec.ts` exists in your `practice/` and contains the test `loads shipments and toggles the loading flag`.
- [ ] You added the tests for the error path and `add()` on your own.
- [ ] `npx ng test --no-watch --no-progress` finishes with no failed tests.
- [ ] You can explain what `http.verify()` is for and why the test has no `await`.

---

Docs: [Testing overview](https://angular.dev/guide/testing) · [Testing services](https://angular.dev/guide/testing/services) · [HTTP testing](https://angular.dev/guide/http/testing)

[← Previous: Signal Forms vs Reactive Forms vs template-driven](../day-04-routing-forms/05-forms-comparison-reactive.md) · [Next: Unit testing a component: ShipmentCard →](02-testing-a-component.md)
