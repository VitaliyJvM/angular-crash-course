# COURSE-PLAN — Angular Crash Course for Experienced Developers

[English](../en/COURSE-PLAN.md) | **Українська**

5 днів · 30 уроків · **300 хвилин** (рівно 60 хв на день). Час кожного уроку включає читання, введення коду, запуск, самостійну вправу, перевірку та interview checkpoint.

Перевірена технічна база (2026-11-10): Angular **22.2**, Angular CLI 22.2.6, TypeScript 6.0, Node.js 24 (підтримуються `^22.22.3 || ^24.15.0 || >=26`), RxJS 7.8, Vitest 5 + jsdom.

## Day 1 — Angular Fundamentals & Project Structure

| # | Тема | Хв | Практичний результат | Файл |
|---|------|----|----------------------|------|
| 1.1 | Angular vs React: mental model | 5 | Можеш назвати 5 архітектурних відмінностей Angular від React | [01](lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) |
| 1.2 | Angular CLI та створення workspace | 15 | Власний workspace `practice/` створено і запущено на `localhost:4200` | [02](lessons/day-01-fundamentals/02-cli-and-workspace-setup.md) |
| 1.3 | Тур по workspace: від `angular.json` до `App` | 10 | Простежено шлях `index.html → main.ts → app.config.ts → App` | [03](lessons/day-01-fundamentals/03-workspace-tour.md) |
| 1.4 | Перший компонент: `ShipmentList` | 15 | Згенеровано feature-компонент і відрендерено його в `App` | [04](lessons/day-01-fundamentals/04-first-component.md) |
| 1.5 | Template bindings | 10 | Interpolation, property binding, class binding та event binding працюють на кнопці | [05](lessons/day-01-fundamentals/05-template-bindings.md) |
| 1.6 | NgModules vs Standalone | 5 | Можеш пояснити, навіщо були NgModules і як читати legacy-код | [06](lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) |
| | **Разом Day 1** | **60** | | |

## Day 2 — Components, Templates & State

| # | Тема | Хв | Практичний результат | Файл |
|---|------|----|----------------------|------|
| 2.1 | Typed model, `@for` та `@if` | 10 | Список посилок із типізованих mock data | [01](lessons/day-02-components-state/01-typed-model-and-control-flow.md) |
| 2.2 | `signal()` та події: статус-фільтр | 10 | Кнопки фільтра змінюють стан у signal | [02](lessons/day-02-components-state/02-signals-and-events.md) |
| 2.3 | `computed()`: похідний стан і лічильники | 10 | Відфільтрований список і лічильники через `computed` | [03](lessons/day-02-components-state/03-computed-derived-state.md) |
| 2.4 | `input()`: компонент `ShipmentCard` | 10 | Картку винесено в presentational component | [04](lessons/day-02-components-state/04-input-child-component.md) |
| 2.5 | `output()`: подія від child до parent | 10 | «Mark delivered» у картці оновлює список і лічильники | [05](lessons/day-02-components-state/05-output-child-to-parent.md) |
| 2.6 | Lifecycle, change detection, OnPush і zoneless | 10 | Можеш пояснити, коли Angular перемальовує компонент | [06](lessons/day-02-components-state/06-lifecycle-and-change-detection.md) |
| | **Разом Day 2** | **60** | | |

## Day 3 — Services, DI & Data Loading

| # | Тема | Хв | Практичний результат | Файл |
|---|------|----|----------------------|------|
| 3.1 | Services та `inject()`: `ShipmentStore` | 10 | Стан посилок перенесено з компонента в сервіс | [01](lessons/day-03-services-http/01-services-and-inject.md) |
| 3.2 | DI: provider scopes і порівняння зі Spring | 5 | Можеш пояснити рівні injectors і відмінності від Spring DI | [02](lessons/day-03-services-http/02-di-scopes-vs-spring.md) |
| 3.3 | `HttpClient`: GET із JSON fixture | 15 | Дані завантажуються з `public/data/shipments.json`, відповідь типізована | [03](lessons/day-03-services-http/03-httpclient-get-fixture.md) |
| 3.4 | Loading / error / empty states | 10 | UI коректно показує всі чотири стани, є Retry | [04](lessons/day-03-services-http/04-loading-error-empty-states.md) |
| 3.5 | Observable basics і безпечні subscriptions: пошук із debounce | 15 | Пошук за tracking number через `toObservable → debounceTime → toSignal` | [05](lessons/day-03-services-http/05-observables-and-interop.md) |
| 3.6 | Signals vs RxJS: що коли обирати | 5 | Можеш аргументувати вибір signal чи Observable | [06](lessons/day-03-services-http/06-signals-vs-rxjs.md) |
| | **Разом Day 3** | **60** | | |

## Day 4 — Router & Forms

| # | Тема | Хв | Практичний результат | Файл |
|---|------|----|----------------------|------|
| 4.1 | Routes та навігація | 10 | `/shipments` працює через `<router-outlet>`, є nav | [01](lessons/day-04-routing-forms/01-routes-and-navigation.md) |
| 4.2 | Route parameters: сторінка `ShipmentDetails` | 15 | `/shipments/:id` показує деталі та tracking events | [02](lessons/day-04-routing-forms/02-route-params-details.md) |
| 4.3 | Signal Forms: форма створення посилки | 15 | Форма на `/shipments/new` додає посилку в пам'ять | [03](lessons/day-04-routing-forms/03-signal-forms-basics.md) |
| 4.4 | Validation, повідомлення про помилки та submit | 10 | `required`, `pattern`, custom validator і доступні повідомлення | [04](lessons/day-04-routing-forms/04-validation-and-submit.md) |
| 4.5 | Signal Forms vs Reactive Forms vs template-driven | 10 | Компактна Reactive Forms версія + можеш порівняти три підходи | [05](lessons/day-04-routing-forms/05-forms-comparison-reactive.md) |
| | **Разом Day 4** | **60** | | |

## Day 5 — Quality, Best Practices & Interview

| # | Тема | Хв | Практичний результат | Файл |
|---|------|----|----------------------|------|
| 5.1 | Unit test сервісу: `ShipmentStore` | 10 | Тест із `HttpTestingController` проходить у Vitest | [01](lessons/day-05-quality-interview/01-testing-a-service.md) |
| 5.2 | Unit test компонента: `ShipmentCard` | 10 | Тест input/output/DOM проходить | [02](lessons/day-05-quality-interview/02-testing-a-component.md) |
| 5.3 | Production structure та common mistakes | 5 | Власний код перевірено за списком типових помилок | [03](lessons/day-05-quality-interview/03-production-structure-and-mistakes.md) |
| 5.4 | Accessibility та security basics | 5 | Застосунок пройдено з клавіатури; знаєш межі frontend security | [04](lessons/day-05-quality-interview/04-accessibility-and-security.md) |
| 5.5 | Angular vs React: decision guide | 5 | 60-секундна відповідь «When would you choose Angular?» | [05](lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md) |
| 5.6 | Final challenge: видалення посилки | 15 | Самостійно додано `remove` + output + unit test | [06](lessons/day-05-quality-interview/06-final-challenge.md) |
| 5.7 | Interview review | 10 | 10 rapid-fire питань пройдено вголос англійською | [07](lessons/day-05-quality-interview/07-interview-review.md) |
| | **Разом Day 5** | **60** | | |

## Перевірка часу

| День | Уроків | Хвилин |
|------|--------|--------|
| Day 1 | 6 | 5 + 15 + 10 + 15 + 10 + 5 = **60** |
| Day 2 | 6 | 10 × 6 = **60** |
| Day 3 | 6 | 10 + 5 + 15 + 10 + 15 + 5 = **60** |
| Day 4 | 5 | 10 + 15 + 15 + 10 + 10 = **60** |
| Day 5 | 7 | 10 + 10 + 5 + 5 + 5 + 15 + 10 = **60** |
| **Усього** | **30** | **300** |

## Рішення щодо scope (компроміси)

- **Основний шлях форм — Signal Forms**, Reactive Forms — компактний робочий приклад, template-driven — лише фрагмент для читання. Аргументація — в уроці 4.5.
- **Дані: `HttpClient` + store на signals**, а не `httpResource`: застосунку потрібні in-memory зміни поверх завантажених даних, а `HttpClient`/Observable — те, що є в кожній enterprise-codebase. `httpResource` показано оглядово в 3.6.
- **Без backend.** JSON fixture віддає dev server; працює лише GET. Додавання посилки та «Mark delivered» живуть у пам'яті й зникають після reload.
- **Тести — лише Day 5** (компоненти генеруються з `--skip-tests`), щоб не витрачати час перших днів на супровід згенерованих spec-файлів.
- Stretch-частина final challenge та все, що позначено **Optional / Outside 5-hour course**, не входить у 300 хвилин.

## Поза курсом (Optional / Outside 5-hour course)

NgRx / SignalStore, SSR та hydration, interceptors і auth (Keycloak/OIDC), route guards/resolvers, поглиблений RxJS, `httpResource`/`resource`, реальний Spring Boot backend, Docker, CI/CD, Angular Material/CDK, e2e-тести.
