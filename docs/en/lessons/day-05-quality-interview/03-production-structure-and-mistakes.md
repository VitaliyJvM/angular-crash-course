# Day 5 · Lesson 3 — Production structure and common mistakes

**English** | [Українська](../../../uk/lessons/day-05-quality-interview/03-production-structure-and-mistakes.md)

**Estimated time:** 5 min · **Time budget:** read 2 · review 2 · try 1

**Learning outcome:** explain the responsibility of every file in the `shipments` feature and find typical Angular mistakes in your own code using a checklist.

[← Previous: Unit testing a component: ShipmentCard](02-testing-a-component.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Accessibility and security basics →](04-accessibility-and-security.md)

## Why it matters

Angular projects live for years and move between teams; a predictable structure matters more than local "convenience". The question "how do you structure an Angular app?" is a standard one in interviews.

## Concept

The final structure of ParcelFlow Lite (feature-based):

```text
src/app/
├── app.ts / app.html / app.css      # shell: header, nav, <router-outlet />
├── app.config.ts                    # application-level providers
├── app.routes.ts                    # routes, lazy loadComponent
└── features/shipments/
    ├── shipment.model.ts            # typed models: Shipment, ShipmentStatus, NewShipment
    ├── shipment-api.ts              # data access: HttpClient, URLs, no state
    ├── shipment-store.ts            # state: signals + load/add/markDelivered
    ├── shipment-list/               # smart (page) component: injects store, owns UI state
    ├── shipment-details/            # smart (page) component: route param -> computed
    ├── shipment-form/               # smart (page) component: Signal Form
    ├── shipment-form-reactive/      # comparison only
    └── shipment-card/               # presentational: input() / output(), no services
```

| Layer | Responsible for | Spring analogy (incomplete) |
| --- | --- | --- |
| `*.model.ts` | domain types | DTO / record |
| `ShipmentApi` | HTTP, no state | `RestClient` / Feign client |
| `ShipmentStore` | feature state, business operations | `@Service` (but with state in the client's memory) |
| page components | glue together store + UI state + routing | controller |
| presentational | rendering, events up | view / template fragment |

When the application grows: `core/` holds cross-cutting singletons (auth, interceptors, layout); `shared/` holds reusable UI components, pipes and utilities with no knowledge of features; every feature gets its own folder and its own lazy routes (`loadComponent` / `loadChildren`). A feature does not import the internals of another feature.

Common mistakes → fix:

1. Mutating an array inside a signal (`shipments().push(x)`) → the UI will not update; return a new array through `update()`.
2. Derived state in a separate `signal` that is synchronized by hand → `computed()`.
3. `effect()` for copying one signal into another → `computed()` / `linkedSignal()`; `effect` is only for outward side effects (logging, localStorage, DOM API).
4. A "bare" `subscribe()` to a long-lived stream in a component → memory leak; use `toSignal`, the `async` pipe or `takeUntilDestroyed()`.
5. `http.get<any>(...)` → type the response with a model.
6. Business logic or heavy computations in the template (`{{ heavyCalc() }}`, `.filter()` in `@for`) → move them into `computed`.
7. `@for` without a stable `track` (or `track $index` for a list that changes) → unnecessary DOM re-creation; `track item.id`.
8. `[innerHTML]` with unverified data → see the next lesson.

## Follow along

1. In `practice/`, open the `src/app/features/shipments/` folder and compare it with the tree above (2 min together with step 2).
2. Go through mistakes 1–7 and for each item find the place in your code where things could have gone wrong: `markDelivered`/`add` in the store (item 1), `counters` and `filteredShipments` (items 2, 6), the debounced search (item 4), `getAll()` (item 5), every `@for` (item 7).
3. If you find a deviation, fix it right away.

## Try it yourself

Without looking at the code, answer (aloud, 2–3 sentences): why do `statusFilter` and `searchTerm` live in `ShipmentList`, while `shipments` lives in `ShipmentStore`? What would change if the filter had to be preserved when navigating to the details page and back?

## Verify / Expected result

- `grep -rn "any" src/app --include=*.ts` shows no `any` in data types (except, possibly, in comments).
- `grep -rn "subscribe(" src/app --include=*.ts --exclude=*.spec.ts` shows a single `subscribe` — in `ShipmentStore.load()` (an HTTP observable that completes on its own).
- Every `@for` in the templates has a `track` by `id` or by the primitive value itself.

## Common mistake / Best practice

**Pitfall:** mutating data inside a signal — `this._shipments().push(shipment)`. Consequence: the array reference has not changed, so the signal does not notify dependent `computed` signals and templates; the list and the counters "freeze", and without a single error in the console. **Correct:** `this._shipments.update((list) => [...list, shipment])` — an immutable update, just like with `setState` in React.

## Interview checkpoint

**Q: How do you structure a medium-size Angular application?**

A: By feature, not by file type. Each feature folder has its models, a data-access service, a state service, page components and small presentational components, and is lazy-loaded through the router. Cross-cutting singletons go to `core`, reusable UI to `shared`.

**Q: Smart vs presentational components?**

A: Smart components inject services, own state and handle routing. Presentational components only take inputs and emit outputs, so they are easy to reuse and test.

## Done when

- [ ] You can name the responsibility of every file in `features/shipments/`.
- [ ] You checked your code against items 1–7 and found no deviations (or fixed them).
- [ ] You can explain the smart / presentational difference using `ShipmentList` and `ShipmentCard` as the example.

---

Docs: [Style guide](https://angular.dev/style-guide) · [File structure](https://angular.dev/reference/configs/file-structure) · [Signals](https://angular.dev/guide/signals)

[← Previous: Unit testing a component: ShipmentCard](02-testing-a-component.md) · [Next: Accessibility and security basics →](04-accessibility-and-security.md)
