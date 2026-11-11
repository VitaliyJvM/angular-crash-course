# Day 5 · Lesson 7 — Interview review

[English](../../../en/lessons/day-05-quality-interview/07-interview-review.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** rapid-fire 6 · self-assessment 2 · try 2

**Learning outcome:** відповісти вголос англійською на 10 базових Angular interview questions і визначити теми, які треба повторити.

[← Попередній: Final challenge: видалення посилки](06-final-challenge.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Completion checklist →](../../PROGRESS.md)

## Why it matters

Знати відповідь і вміти вимовити її за 20–30 секунд англійською — різні навички. Цей урок тренує другу й показує прогалини, доки їх ще дешево закрити.

## Concept

Формула короткої відповіді: **definition → why/when → one concrete detail** (бажано з вашого проєкту: «in my sample app the store exposes read-only signals…»). 2–3 речення; якщо інтерв'юер хоче глибше — він спитає.

Повний перелік питань за темами: [reference/interview-questions.md](../../reference/interview-questions.md).

## Follow along

Для кожного питання: прочитайте → дайте відповідь **вголос** англійською (до 30 с) → розгорніть модельну відповідь → поставте собі `yes / partly / no` у таблиці нижче.

1. **How does Angular differ from React architecturally?**
   <details><summary>Answer</summary>

   Angular is a full framework: components, templates, DI, router, forms and HTTP come as one opinionated platform. React is a UI library where you compose routing, data fetching and state from the ecosystem. Angular separates templates from classes and relies on DI; React uses JSX and hooks.

   </details>

2. **What are standalone components, and how do they relate to NgModules?**
   <details><summary>Answer</summary>

   A standalone component declares its own template dependencies in `imports`, so no NgModule is needed; it is the default in modern Angular. NgModules used to group declarations and providers and still exist in older codebases and some libraries. Both can interoperate during migration.

   </details>

3. **Signals vs RxJS — when do you use each?**
   <details><summary>Answer</summary>

   Signals hold synchronous state and derived values and drive template updates. RxJS models asynchronous streams of events over time: HTTP, debouncing, cancellation, combining streams. They interoperate with `toSignal` and `toObservable`; a common pattern is RxJS at the edges and signals for view state.

   </details>

4. **What is the difference between `computed` and `effect`?**
   <details><summary>Answer</summary>

   `computed` derives a value from other signals; it is lazy, memoized and must be pure. `effect` runs a side effect when its signals change, such as logging or syncing to localStorage. You should not use effects to copy state between signals — use `computed` or `linkedSignal` instead.

   </details>

5. **How does change detection work in modern Angular? What are OnPush and zoneless?**
   <details><summary>Answer</summary>

   Angular re-renders a component's view when it is marked dirty. With OnPush, the default since v22, that happens when an input reference changes, a template event fires, or a signal read in the template changes. Zoneless means Angular no longer patches browser APIs with zone.js; signals and events notify the scheduler directly.

   </details>

6. **How does dependency injection work, and what provider scopes exist?**
   <details><summary>Answer</summary>

   Angular has a hierarchical injector tree. Services are usually application-wide singletons, provided in root automatically; they can also be provided at route level or in a component's `providers`, which creates an instance per component subtree. Dependencies are requested with `inject()`. It is similar to Spring's container, but hierarchical and resolved at runtime in the browser.

   </details>

7. **How do components communicate?**
   <details><summary>Answer</summary>

   Parent to child through `input()` signals, child to parent through `output()` events, and unrelated components through a shared service that holds state. `model()` gives two-way binding when needed. Data flows down, events flow up.

   </details>

8. **How do you load data with HttpClient and handle loading and errors?**
   <details><summary>Answer</summary>

   A data-access service returns a typed Observable from `http.get<T>()`. A state service or the component exposes loading, error and data as signals, and the template renders each state with `@if`. HTTP observables complete after one response; for long-lived streams I use `toSignal`, the async pipe or `takeUntilDestroyed` to avoid leaks. `httpResource` is the newer signal-based alternative.

   </details>

9. **How do routing, route parameters and lazy loading work?**
   <details><summary>Answer</summary>

   Routes are a config array passed to `provideRouter`. Parameters like `:id` can be read from `ActivatedRoute` or bound directly to component inputs with `withComponentInputBinding`. `loadComponent` and `loadChildren` use dynamic imports, so the feature code is split into a separate chunk and loaded on first navigation.

   </details>

10. **Compare Signal Forms, Reactive Forms and template-driven forms. How do you test Angular code?**
    <details><summary>Answer</summary>

    Signal Forms, stable since v22, use a writable signal as the model with a typed schema of validators; they fit new signal-based apps. Reactive Forms use a `FormGroup`/`FormControl` tree with observables and dominate existing enterprise code. Template-driven forms use `ngModel` and suit very simple forms. For tests, the CLI sets up Vitest with jsdom; I use TestBed, `provideHttpClientTesting`, `setInput` and `whenStable`.

    </details>

## Try it yourself

Оберіть **одне** питання з оцінкою `partly` або `no` і перекажіть відповідь **своїми словами** з прикладом із ParcelFlow Lite (назвіть конкретний файл або клас). Якщо всі `yes` — візьміть питання 5 або 6 і поясніть його без термінів з модельної відповіді.

Hint: запишіть відповідь на диктофон і прослухайте — паузи й «um» показують, де бракує розуміння, а не англійської.

## Verify / Expected result

**Interview Self-Assessment** — «Can explain in English without notes»:

| # | Topic | yes / partly / no |
| --- | --- | --- |
| 1 | Angular vs React architecture | |
| 2 | Standalone vs NgModules | |
| 3 | Signals vs RxJS | |
| 4 | `computed` vs `effect` | |
| 5 | Change detection, OnPush, zoneless | |
| 6 | DI and provider scopes | |
| 7 | `input()` / `output()` | |
| 8 | HttpClient, loading/error handling | |
| 9 | Router: params, lazy loading | |
| 10 | Forms approaches; testing setup | |

Ціль: щонайменше 8 × `yes`. Для кожного `partly`/`no` поверніться до відповідного уроку (номери запитань → дні: 1–2 → Day 1; 4, 5, 7 → Day 2; 3, 6, 8 → Day 3; 9, 10 → Day 4; 10 → Day 5) і до [interview-questions.md](../../reference/interview-questions.md).

## Common mistake / Best practice

**Пастка:** відповідати legacy-термінами як сучасною нормою — «every component belongs to an NgModule», «change detection is triggered by zone.js», «use `@Input()` and `*ngIf`». Наслідок: враження, що знання застаріли на кілька версій. **Правильно:** спершу сучасний підхід (standalone, signals, `@if`, zoneless/OnPush), потім одне речення про legacy: «in older codebases you will still see …» — це показує і актуальність, і готовність працювати з наявним кодом.

## Interview checkpoint

**Q: What would you learn next to be productive in a real Angular project?**

A: State management at scale with NgRx SignalStore, HTTP interceptors and authentication with OIDC, route guards and resolvers, and deeper RxJS for complex async flows. I would also look at SSR with hydration and end-to-end testing with Playwright.

**Q: You come from React — what was the biggest mindset shift?**

A: Moving from "everything is a function and a hook" to a framework with dependency injection and templates. State and logic live in injectable services instead of hooks and context, and signals update only what depends on them instead of re-running the component function.

## Done when

- [ ] Відповіли вголос на всі 10 питань.
- [ ] Заповнили таблицю Self-Assessment; маєте ≥ 8 `yes` або список уроків для повторення.
- [ ] Переказали одну слабку тему з прикладом із власного коду.
- [ ] Позначили Day 5 у [PROGRESS.md](../../PROGRESS.md).

## Next Steps (Optional, outside course)

- **State management:** NgRx, NgRx SignalStore.
- **SSR & hydration:** `@angular/ssr`.
- **Interceptors & auth:** `withInterceptors`, Keycloak / OIDC.
- **Route guards & resolvers:** `canActivate`, `canMatch`, `resolve`.
- **Deeper RxJS:** `switchMap`, `combineLatest`, error/retry strategies.
- **Signal-based data loading:** `httpResource`, `resource`, `rxResource`.
- **Real backend:** Spring Boot REST API замість JSON fixture (POST/PUT/DELETE, proxy config).
- **Delivery:** Docker, CI/CD.
- **UI:** Angular Material / CDK.
- **E2E:** Playwright.

---

Docs: [angular.dev](https://angular.dev/) · [Signals](https://angular.dev/guide/signals) · [Dependency injection](https://angular.dev/guide/di)

[← Попередній: Final challenge: видалення посилки](06-final-challenge.md) · [Наступний: Completion checklist →](../../PROGRESS.md)
