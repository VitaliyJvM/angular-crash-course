# Day 5 · Lesson 3 — Production structure та common mistakes

**Estimated time:** 5 хв · **Time budget:** read 2 · review 2 · try 1
**Learning outcome:** пояснити відповідальність кожного файлу feature `shipments` і знайти у власному коді типові Angular-помилки за чеклістом.

[← Попередній: Unit test компонента: ShipmentCard](02-testing-a-component.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Accessibility та security basics →](04-accessibility-and-security.md)

## Why it matters

Angular-проєкти живуть роками й переходять між командами; передбачувана структура важить більше за локальну «зручність». Питання «how do you structure an Angular app?» — стандартне на співбесіді.

## Concept

Фінальна структура ParcelFlow Lite (feature-based):

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

| Шар | Відповідає за | Spring-аналогія (неповна) |
| --- | --- | --- |
| `*.model.ts` | типи домену | DTO / record |
| `ShipmentApi` | HTTP, без стану | `RestClient` / Feign client |
| `ShipmentStore` | стан feature, бізнес-операції | `@Service` (але зі станом у пам'яті клієнта) |
| page components | склеюють store + UI state + routing | controller |
| presentational | відображення, події вгору | view / template fragment |

Коли застосунок росте: `core/` — наскрізні singleton-речі (auth, interceptors, layout); `shared/` — перевикористовувані UI-компоненти, pipes, утиліти без знання про features; кожна feature — власна тека й власні lazy routes (`loadComponent` / `loadChildren`). Feature не імпортує нутрощі іншої feature.

Common mistakes → fix:

1. Мутація масиву в signal (`shipments().push(x)`) → UI не оновиться; повертайте новий масив через `update()`.
2. Похідний стан в окремому `signal`, який синхронізують руками → `computed()`.
3. `effect()` для копіювання одного signal в інший → `computed()` / `linkedSignal()`; `effect` — лише для side effects назовні (logging, localStorage, DOM API).
4. «Голий» `subscribe()` на довгоживучий stream у компоненті → memory leak; `toSignal`, `async` pipe або `takeUntilDestroyed()`.
5. `http.get<any>(...)` → типізуйте відповідь моделлю.
6. Бізнес-логіка або важкі обчислення у template (`{{ heavyCalc() }}`, `.filter()` у `@for`) → перенесіть у `computed`.
7. `@for` без стабільного `track` (або `track $index` для списку, що змінюється) → зайві перестворення DOM; `track item.id`.
8. `[innerHTML]` з неперевіреними даними → див. наступний урок.

## Follow along

1. Відкрийте у `practice/` теку `src/app/features/shipments/` і порівняйте з деревом вище (2 хв разом із кроком 2).
2. Пройдіть список mistakes 1–7 і для кожного пункту знайдіть місце у своєму коді, де могло б піти не так: `markDelivered`/`add` у store (п. 1), `counters` і `filteredShipments` (п. 2, 6), пошук із debounce (п. 4), `getAll()` (п. 5), усі `@for` (п. 7).
3. Якщо знайшли відхилення — виправте одразу.

## Try it yourself

Без перегляду коду дайте відповідь (усно, 2–3 речення): чому `statusFilter` і `searchTerm` живуть у `ShipmentList`, а `shipments` — у `ShipmentStore`? Що змінилося б, якби фільтр мав зберігатися при переході на деталі й назад?

## Verify / Expected result

- `grep -rn "any" src/app --include=*.ts` не показує `any` у типах даних (окрім, можливо, коментарів).
- `grep -rn "subscribe(" src/app --include=*.ts --exclude=*.spec.ts` показує єдиний `subscribe` — у `ShipmentStore.load()` (HTTP-observable, що завершується сам).
- Кожен `@for` у шаблонах має `track` за `id` або самим значенням примітива.

## Common mistake / Best practice

**Пастка:** мутувати дані всередині signal — `this._shipments().push(shipment)`. Наслідок: посилання на масив не змінилося, signal не сповіщає залежні `computed` і шаблони; список та лічильники «застигають», причому без жодної помилки в консолі. **Правильно:** `this._shipments.update((list) => [...list, shipment])` — immutable update, як зі `setState` у React.

## Interview checkpoint

**Q: How do you structure a medium-size Angular application?**
A: By feature, not by file type. Each feature folder has its models, a data-access service, a state service, page components and small presentational components, and is lazy-loaded through the router. Cross-cutting singletons go to `core`, reusable UI to `shared`.

**Q: Smart vs presentational components?**
A: Smart components inject services, own state and handle routing. Presentational components only take inputs and emit outputs, so they are easy to reuse and test.

## Done when

- [ ] Можете назвати відповідальність кожного файлу у `features/shipments/`.
- [ ] Перевірили свій код за пунктами 1–7 і не знайшли (або виправили) відхилення.
- [ ] Можете пояснити різницю smart / presentational на прикладі `ShipmentList` і `ShipmentCard`.

---

Docs: [Style guide](https://angular.dev/style-guide) · [File structure](https://angular.dev/reference/configs/file-structure) · [Signals](https://angular.dev/guide/signals)

[← Попередній: Unit test компонента: ShipmentCard](02-testing-a-component.md) · [Наступний: Accessibility та security basics →](04-accessibility-and-security.md)
