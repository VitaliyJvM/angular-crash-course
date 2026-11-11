# PROGRESS

[English](../en/PROGRESS.md) | **Українська**

Відмічай `[x]` після блоку **Done when** кожного уроку. План і тривалості — у [COURSE-PLAN.md](COURSE-PLAN.md).

## Day 1 — Angular Fundamentals & Project Structure (60 хв)

- [ ] 1.1 [Angular vs React: mental model](lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) — 5
- [ ] 1.2 [Angular CLI та створення workspace](lessons/day-01-fundamentals/02-cli-and-workspace-setup.md) — 15
- [ ] 1.3 [Тур по workspace](lessons/day-01-fundamentals/03-workspace-tour.md) — 10
- [ ] 1.4 [Перший компонент: ShipmentList](lessons/day-01-fundamentals/04-first-component.md) — 15
- [ ] 1.5 [Template bindings](lessons/day-01-fundamentals/05-template-bindings.md) — 10
- [ ] 1.6 [NgModules vs Standalone](lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) — 5

**День завершено, коли:** `practice/` запускається через `npm start`; `App` рендерить `ShipmentList`; кнопка з bindings працює; можеш пояснити ланцюжок bootstrap і різницю NgModules/standalone.

## Day 2 — Components, Templates & State (60 хв)

- [ ] 2.1 [Typed model, @for та @if](lessons/day-02-components-state/01-typed-model-and-control-flow.md) — 10
- [ ] 2.2 [signal() та події: статус-фільтр](lessons/day-02-components-state/02-signals-and-events.md) — 10
- [ ] 2.3 [computed(): похідний стан і лічильники](lessons/day-02-components-state/03-computed-derived-state.md) — 10
- [ ] 2.4 [input(): компонент ShipmentCard](lessons/day-02-components-state/04-input-child-component.md) — 10
- [ ] 2.5 [output(): подія від child до parent](lessons/day-02-components-state/05-output-child-to-parent.md) — 10
- [ ] 2.6 [Lifecycle, change detection, OnPush і zoneless](lessons/day-02-components-state/06-lifecycle-and-change-detection.md) — 10

**День завершено, коли:** список із 5 mock-посилок фільтрується за статусом; лічильники оновлюються після «Mark delivered»; картка — окремий компонент з `input()`/`output()`; можеш пояснити `signal` vs `computed` vs `effect` і чому view оновлюється без zone.js.

## Day 3 — Services, DI & Data Loading (60 хв)

- [ ] 3.1 [Services та inject(): ShipmentStore](lessons/day-03-services-http/01-services-and-inject.md) — 10
- [ ] 3.2 [DI: provider scopes і порівняння зі Spring](lessons/day-03-services-http/02-di-scopes-vs-spring.md) — 5
- [ ] 3.3 [HttpClient: GET із JSON fixture](lessons/day-03-services-http/03-httpclient-get-fixture.md) — 15
- [ ] 3.4 [Loading / error / empty states](lessons/day-03-services-http/04-loading-error-empty-states.md) — 10
- [ ] 3.5 [Observable basics і безпечні subscriptions](lessons/day-03-services-http/05-observables-and-interop.md) — 15
- [ ] 3.6 [Signals vs RxJS: що коли обирати](lessons/day-03-services-http/06-signals-vs-rxjs.md) — 5

**День завершено, коли:** дані приходять із `data/shipments.json` (видно в Network); стани loading / error + Retry / empty / content працюють; пошук із debounce фільтрує список; у компонентах немає ручних `subscribe`; можеш порівняти Angular DI зі Spring і Signals з RxJS.

## Day 4 — Router & Forms (60 хв)

- [ ] 4.1 [Routes та навігація](lessons/day-04-routing-forms/01-routes-and-navigation.md) — 10
- [ ] 4.2 [Route parameters: сторінка ShipmentDetails](lessons/day-04-routing-forms/02-route-params-details.md) — 15
- [ ] 4.3 [Signal Forms: форма створення посилки](lessons/day-04-routing-forms/03-signal-forms-basics.md) — 15
- [ ] 4.4 [Validation, повідомлення про помилки та submit](lessons/day-04-routing-forms/04-validation-and-submit.md) — 10
- [ ] 4.5 [Signal Forms vs Reactive Forms vs template-driven](lessons/day-04-routing-forms/05-forms-comparison-reactive.md) — 10

**День завершено, коли:** працюють `/shipments`, `/shipments/:id`, `/shipments/new`; пряме відкриття URL деталей працює; форма не пропускає порожні, некоректні та дубльовані tracking numbers; нова посилка з'являється у списку (і зникає після reload — це очікувано); можеш порівняти три підходи до форм.

## Day 5 — Quality, Best Practices & Interview (60 хв)

- [ ] 5.1 [Unit test сервісу: ShipmentStore](lessons/day-05-quality-interview/01-testing-a-service.md) — 10
- [ ] 5.2 [Unit test компонента: ShipmentCard](lessons/day-05-quality-interview/02-testing-a-component.md) — 10
- [ ] 5.3 [Production structure та common mistakes](lessons/day-05-quality-interview/03-production-structure-and-mistakes.md) — 5
- [ ] 5.4 [Accessibility та security basics](lessons/day-05-quality-interview/04-accessibility-and-security.md) — 5
- [ ] 5.5 [Angular vs React: decision guide](lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md) — 5
- [ ] 5.6 [Final challenge: видалення посилки](lessons/day-05-quality-interview/06-final-challenge.md) — 15
- [ ] 5.7 [Interview review](lessons/day-05-quality-interview/07-interview-review.md) — 10

**День завершено, коли:** `npx ng test --no-watch` зелений і містить твої тести; final challenge (Required) зроблено без підглядання в розв'язок; 10 rapid-fire питань пройдено вголос англійською.

---

## Completion Checklist

- [ ] Власний workspace `practice/` збирається: `npx ng build` без помилок.
- [ ] `npx ng test --no-watch` — усі тести проходять.
- [ ] Застосунок має: список, статус-фільтр, пошук, лічильники, деталі за `:id`, форму з validation, loading/error/empty states.
- [ ] Final challenge (Required) виконано самостійно.
- [ ] Можу намалювати з пам'яті структуру `src/app` і пояснити відповідальність кожного файла.
- [ ] Можу пояснити, чому дані зникають після reload і що треба для справжнього збереження.

## Interview Self-Assessment

Оціни кожну тему: **2** — пояснюю англійською без нотаток, **1** — частково, **0** — ні. Усе, що нижче 2, повтори за [interview-questions.md](reference/interview-questions.md).

| Тема | Оцінка | Де повторити |
|------|--------|--------------|
| Angular vs React: архітектура, коли що обирати | | 1.1, 5.5, [angular-vs-react](reference/angular-vs-react.md) |
| Bootstrap, workspace, standalone vs NgModules | | 1.3, 1.6 |
| Templates: bindings, `@if` / `@for`, `track` | | 1.5, 2.1 |
| `signal` / `computed` / `effect` vs React hooks | | 2.2, 2.3 |
| `input()` / `output()`, smart vs presentational | | 2.4, 2.5 |
| Change detection, OnPush, zoneless | | 2.6 |
| Services, DI, provider scopes, порівняння зі Spring | | 3.1, 3.2 |
| `HttpClient`, Observable vs Promise, loading/error states | | 3.3, 3.4 |
| Signals vs RxJS, уникнення subscription leaks | | 3.5, 3.6 |
| Router: params, lazy loading, navigation | | 4.1, 4.2 |
| Signal Forms vs Reactive Forms vs template-driven | | 4.3–4.5 |
| Testing: Vitest, `TestBed`, `HttpTestingController` | | 5.1, 5.2 |
| Accessibility та frontend security | | 5.4 |

## Next Steps (Optional, outside course)

1. **Справжній backend:** Spring Boot REST API для ParcelFlow Lite, POST/PUT/DELETE, proxy config для dev server, обробка server-side validation errors у формі.
2. **Interceptors і auth:** `provideHttpClient(withInterceptors(...))`, OIDC / Keycloak, route guards.
3. **`httpResource` / `resource`:** перепиши завантаження списку на signal-based resource і порівняй зі store.
4. **Глибше RxJS:** `switchMap`, `combineLatest`, `catchError`, `retry`, `shareReplay`.
5. **State management:** NgRx SignalStore або NgRx Store — коли сервісів із signals стає недостатньо.
6. **SSR і hydration**, `@defer`, performance budgets.
7. **UI:** Angular Material + CDK, accessibility audit.
8. **Якість і доставка:** ESLint (`angular-eslint`), e2e на Playwright, Docker, CI/CD.

## Verification (що реально перевірено під час створення курсу)

Середовище: Node.js 24.22.2, npm 11.19.1, Angular CLI 22.2.6, Angular 22.2.5, TypeScript 6.0, Vitest 5.1, macOS. Дата: 2026-11-10.

| Що | Команда | Результат |
|----|---------|-----------|
| Створення workspace | `npx @angular/cli@22 new parcelflow-lite --directory app …` | успішно |
| Стан кінця Day 1 | `ng build`, `ng test --no-watch` | build OK, 2 тести пройшли |
| Стан кінця Day 2, Day 3, Day 4 | `ng build` | OK |
| Фінальний стан `app/` | `ng build` | OK; lazy chunks `shipment-form`, `shipment-form-reactive` |
| Фінальний стан `app/` | `ng test --no-watch --no-progress` | 4 файли, 11 тестів пройшли |
| Dev server | `ng serve` + HTTP-запити | `/shipments/2` → 200, `/data/shipments.json` → JSON, неіснуючий fixture → 404 |
| Рендеринг списку, фільтра, деталей, «not found» | тимчасовий тест із `RouterTestingHarness` у копії проєкту | пройшов |
| Розв'язок final challenge (Required + Stretch) | `ng test`, `ng build` у копії проєкту | 13 тестів пройшли, build OK |
| Твердження уроків: `NG0950`, поведінка звичайного поля без signal, sanitization `[innerHTML]`, типізація output | тимчасові тести / build у копії проєкту | підтверджено |

**Не перевірено:**

- Проміжні стани **всередині** дня (після окремого уроку) не збиралися окремо — лише стани на кінець Day 1–4 і фінальний.
- Розв'язки блоків Try it yourself (`exercises/solutions/uk/day-0N.md`) написані без окремої компіляції, крім final challenge.
- Застосунок не проганявся вручну в реальному браузері: поведінку перевірено unit-тестами в jsdom, build і запитами до dev server.
- Команда `ng new … --directory practice` як така не запускалася (запускався її аналог з `--directory app`).
