# Solutions — Day 3 (Services, DI & Data Loading)

**English** | [Українська](../uk/day-03.md)

> ⚠️ Don't read ahead. Open a section only after you have tried the corresponding "Try it yourself" on your own.

## Lesson 1 — writing to a read-only signal

`this.store.shipments.set([])` does not compile: `Property 'set' does not exist on type 'Signal<Shipment[]>'`.

`asReadonly()` returns the type `Signal<T>` — it only supports reading. `set` / `update` exist only on `WritableSignal<T>`, which remains the private field `_shipments`. So the state can be changed only through the public methods of the store — the compiler guarantees encapsulation.

## Lesson 2 — providers in ShipmentCard

`ShipmentStore created` will appear **6 times**: once for the app-wide instance (injected by `ShipmentList`) and once for each of the 5 cards.

`providers: [ShipmentStore]` in `@Component` creates a separate instance for **each component instance**. Each card would get its own store with its own copy of the data, and `markDelivered` in a card would not affect the list and the counters — the typical "state is not shared" bug.

## Lesson 3 — `"status": "LOST"` in the fixture

- The build **does not fail**: TypeScript does not see the contents of JSON that arrives at runtime.
- There is **no** runtime error: `get<Shipment[]>` only asserts the type, Angular validates nothing.
- UI: the card shows a `LOST` badge without a color (there is no `.status-LOST` class), the shipment does not fall into any filter except `ALL`, and it is not counted in `In transit` / `Delivered`.

Conclusion: the generic in `HttpClient` is trust in the backend contract, not a check. If the contract cannot be trusted, the response is validated at the boundary (for example, with a schema library such as Zod in `map(...)` or with the `parse` option in `httpResource`), or the types are generated from OpenAPI.

## Lesson 4 — empty state

1. Create `public/data/empty.json` with the contents `[]`.
2. In `shipment-api.ts`, temporarily change the URL to `'data/empty.json'`.
3. The page shows `No shipments yet.` — without counters and filters.
4. Restore the URL `'data/shipments.json'` and delete `empty.json`.

## Lesson 5 — trim before distinctUntilChanged

```ts
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

private readonly debouncedSearchTerm = toSignal(
  toObservable(this.searchTerm).pipe(
    debounceTime(300),
    map((term) => term.trim()),
    distinctUntilChanged(),
  ),
  { initialValue: '' },
);
```

`map` must come **before** `distinctUntilChanged`, otherwise strings that are not yet normalized are compared. Now the `.trim()` in `filteredShipments` can be removed (optional).

## Lesson 6 — Signals or RxJS

- **(a) Counter by status** — Signals: a `computed` over the list; a synchronous derived value, time is not involved.
- **(b) Autocomplete with a request** — RxJS (+ a signal at the output): you need `debounceTime`, cancellation of the previous request (`switchMap`), error handling; the result reaches the template through `toSignal`.
- **(c) WebSocket status in the template** — both: a stream of events over time is an Observable (reconnect, retry), and for display it is converted to a signal through `toSignal`.
