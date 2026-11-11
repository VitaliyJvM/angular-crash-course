# Solutions — Day 3 (Services, DI & Data Loading)

[English](../en/day-03.md) | **Українська**

> ⚠️ Не читай наперед. Відкривай розділ лише після того, як сам(-а) спробував(-ла) відповідне «Try it yourself».

## Lesson 1 — запис у read-only signal

`this.store.shipments.set([])` не компілюється: `Property 'set' does not exist on type 'Signal<Shipment[]>'`.

`asReadonly()` повертає тип `Signal<T>` — у нього є лише читання. `set` / `update` існують тільки у `WritableSignal<T>`, який лишився приватним полем `_shipments`. Отже, змінити стан можна лише через публічні методи store — компілятор гарантує інкапсуляцію.

## Lesson 2 — providers у ShipmentCard

`ShipmentStore created` з'явиться **6 разів**: 1 раз для app-wide екземпляра (його інжектить `ShipmentList`) і по одному для кожної з 5 карток.

`providers: [ShipmentStore]` у `@Component` створює окремий екземпляр на **кожен екземпляр компонента**. Кожна картка отримала б власний store з власною копією даних, а `markDelivered` у картці не вплинув би на список і лічильники — типовий баг «стан не спільний».

## Lesson 3 — `"status": "LOST"` у fixture

- Збірка **не падає**: TypeScript не бачить вмісту JSON, який приходить у runtime.
- Runtime-помилки **немає**: `get<Shipment[]>` лише стверджує тип, Angular нічого не валідує.
- UI: картка показує badge `LOST` без кольору (немає класу `.status-LOST`), посилка не потрапляє в жоден фільтр, окрім `ALL`, і не рахується в `In transit` / `Delivered`.

Висновок: generic у `HttpClient` — це довіра до backend-контракту, а не перевірка. Якщо контракту не можна довіряти, відповідь валідують на межі (наприклад, schema-бібліотекою на кшталт Zod у `map(...)` або опцією `parse` у `httpResource`), або генерують типи з OpenAPI.

## Lesson 4 — empty state

1. Створи `public/data/empty.json` із вмістом `[]`.
2. У `shipment-api.ts` тимчасово зміни URL на `'data/empty.json'`.
3. Сторінка показує `No shipments yet.` — без лічильників і фільтрів.
4. Поверни URL `'data/shipments.json'` і видали `empty.json`.

## Lesson 5 — trim перед distinctUntilChanged

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

`map` має стояти **перед** `distinctUntilChanged`, інакше порівнюються ще не нормалізовані рядки. Тепер `.trim()` у `filteredShipments` можна прибрати (не обов'язково).

## Lesson 6 — Signals чи RxJS

- **(a) Лічильник за статусом** — Signals: `computed` над списком; синхронне похідне значення, час не потрібен.
- **(b) Autocomplete із запитом** — RxJS (+ signal на виході): потрібні `debounceTime`, скасування попереднього запиту (`switchMap`), обробка помилок; результат у template — через `toSignal`.
- **(c) WebSocket-статус у template** — обидва: потік подій у часі — це Observable (reconnect, retry), а для відображення його перетворюють на signal через `toSignal`.
