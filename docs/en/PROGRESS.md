# PROGRESS

**English** | [Українська](../uk/PROGRESS.md)

Mark `[x]` after the **Done when** block of each lesson. The plan and durations are in [COURSE-PLAN.md](COURSE-PLAN.md).

## Day 1 — Angular Fundamentals & Project Structure (60 min)

- [ ] 1.1 [Angular vs React: mental model](lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) — 5
- [ ] 1.2 [Angular CLI and workspace setup](lessons/day-01-fundamentals/02-cli-and-workspace-setup.md) — 15
- [ ] 1.3 [Workspace tour](lessons/day-01-fundamentals/03-workspace-tour.md) — 10
- [ ] 1.4 [First component: ShipmentList](lessons/day-01-fundamentals/04-first-component.md) — 15
- [ ] 1.5 [Template bindings](lessons/day-01-fundamentals/05-template-bindings.md) — 10
- [ ] 1.6 [NgModules vs Standalone](lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) — 5

**The day is complete when:** `practice/` starts with `npm start`; `App` renders `ShipmentList`; the button with bindings works; you can explain the bootstrap chain and the difference between NgModules and standalone.

## Day 2 — Components, Templates & State (60 min)

- [ ] 2.1 [Typed model, @for and @if](lessons/day-02-components-state/01-typed-model-and-control-flow.md) — 10
- [ ] 2.2 [signal() and events: status filter](lessons/day-02-components-state/02-signals-and-events.md) — 10
- [ ] 2.3 [computed(): derived state and counters](lessons/day-02-components-state/03-computed-derived-state.md) — 10
- [ ] 2.4 [input(): the ShipmentCard component](lessons/day-02-components-state/04-input-child-component.md) — 10
- [ ] 2.5 [output(): child-to-parent events](lessons/day-02-components-state/05-output-child-to-parent.md) — 10
- [ ] 2.6 [Lifecycle, change detection, OnPush and zoneless](lessons/day-02-components-state/06-lifecycle-and-change-detection.md) — 10

**The day is complete when:** the list of 5 mock shipments is filtered by status; the counters update after "Mark delivered"; the card is a separate component with `input()`/`output()`; you can explain `signal` vs `computed` vs `effect` and why the view updates without zone.js.

## Day 3 — Services, DI & Data Loading (60 min)

- [ ] 3.1 [Services and inject(): ShipmentStore](lessons/day-03-services-http/01-services-and-inject.md) — 10
- [ ] 3.2 [DI: provider scopes and comparison with Spring](lessons/day-03-services-http/02-di-scopes-vs-spring.md) — 5
- [ ] 3.3 [HttpClient: GET from a JSON fixture](lessons/day-03-services-http/03-httpclient-get-fixture.md) — 15
- [ ] 3.4 [Loading / error / empty states](lessons/day-03-services-http/04-loading-error-empty-states.md) — 10
- [ ] 3.5 [Observable basics and safe subscriptions](lessons/day-03-services-http/05-observables-and-interop.md) — 15
- [ ] 3.6 [Signals vs RxJS: when to use which](lessons/day-03-services-http/06-signals-vs-rxjs.md) — 5

**The day is complete when:** data comes from `data/shipments.json` (visible in Network); the loading / error + Retry / empty / content states work; the debounced search filters the list; there are no manual `subscribe` calls in components; you can compare Angular DI with Spring and Signals with RxJS.

## Day 4 — Router & Forms (60 min)

- [ ] 4.1 [Routes and navigation](lessons/day-04-routing-forms/01-routes-and-navigation.md) — 10
- [ ] 4.2 [Route parameters: the ShipmentDetails page](lessons/day-04-routing-forms/02-route-params-details.md) — 15
- [ ] 4.3 [Signal Forms: the create-shipment form](lessons/day-04-routing-forms/03-signal-forms-basics.md) — 15
- [ ] 4.4 [Validation, error messages and submit](lessons/day-04-routing-forms/04-validation-and-submit.md) — 10
- [ ] 4.5 [Signal Forms vs Reactive Forms vs template-driven](lessons/day-04-routing-forms/05-forms-comparison-reactive.md) — 10

**The day is complete when:** `/shipments`, `/shipments/:id` and `/shipments/new` work; opening a details URL directly works; the form rejects empty, invalid and duplicate tracking numbers; a new shipment appears in the list (and disappears after a reload — this is expected); you can compare the three approaches to forms.

## Day 5 — Quality, Best Practices & Interview (60 min)

- [ ] 5.1 [Unit testing a service: ShipmentStore](lessons/day-05-quality-interview/01-testing-a-service.md) — 10
- [ ] 5.2 [Unit testing a component: ShipmentCard](lessons/day-05-quality-interview/02-testing-a-component.md) — 10
- [ ] 5.3 [Production structure and common mistakes](lessons/day-05-quality-interview/03-production-structure-and-mistakes.md) — 5
- [ ] 5.4 [Accessibility and security basics](lessons/day-05-quality-interview/04-accessibility-and-security.md) — 5
- [ ] 5.5 [Angular vs React: decision guide](lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md) — 5
- [ ] 5.6 [Final challenge: deleting a shipment](lessons/day-05-quality-interview/06-final-challenge.md) — 15
- [ ] 5.7 [Interview review](lessons/day-05-quality-interview/07-interview-review.md) — 10

**The day is complete when:** `npx ng test --no-watch` is green and includes your tests; the final challenge (Required) is done without peeking at the solution; 10 rapid-fire questions are answered aloud.

---

## Completion Checklist

- [ ] My own `practice/` workspace builds: `npx ng build` without errors.
- [ ] `npx ng test --no-watch` — all tests pass.
- [ ] The application has: a list, a status filter, search, counters, details by `:id`, a form with validation, loading/error/empty states.
- [ ] The final challenge (Required) is completed on my own.
- [ ] I can draw the `src/app` structure from memory and explain the responsibility of each file.
- [ ] I can explain why data disappears after a reload and what is needed for real persistence.

## Interview Self-Assessment

Rate each topic: **2** — I can explain it aloud without notes, **1** — partially, **0** — no. Review everything below 2 using [interview-questions.md](reference/interview-questions.md).

| Topic | Score | Where to review |
|------|--------|--------------|
| Angular vs React: architecture, when to choose which | | 1.1, 5.5, [angular-vs-react](reference/angular-vs-react.md) |
| Bootstrap, workspace, standalone vs NgModules | | 1.3, 1.6 |
| Templates: bindings, `@if` / `@for`, `track` | | 1.5, 2.1 |
| `signal` / `computed` / `effect` vs React hooks | | 2.2, 2.3 |
| `input()` / `output()`, smart vs presentational | | 2.4, 2.5 |
| Change detection, OnPush, zoneless | | 2.6 |
| Services, DI, provider scopes, comparison with Spring | | 3.1, 3.2 |
| `HttpClient`, Observable vs Promise, loading/error states | | 3.3, 3.4 |
| Signals vs RxJS, avoiding subscription leaks | | 3.5, 3.6 |
| Router: params, lazy loading, navigation | | 4.1, 4.2 |
| Signal Forms vs Reactive Forms vs template-driven | | 4.3–4.5 |
| Testing: Vitest, `TestBed`, `HttpTestingController` | | 5.1, 5.2 |
| Accessibility and frontend security | | 5.4 |

## Next Steps (Optional, outside course)

1. **A real backend:** a Spring Boot REST API for ParcelFlow Lite, POST/PUT/DELETE, proxy config for the dev server, handling server-side validation errors in the form.
2. **Interceptors and auth:** `provideHttpClient(withInterceptors(...))`, OIDC / Keycloak, route guards.
3. **`httpResource` / `resource`:** rewrite the list loading with a signal-based resource and compare it with the store.
4. **Deeper RxJS:** `switchMap`, `combineLatest`, `catchError`, `retry`, `shareReplay`.
5. **State management:** NgRx SignalStore or NgRx Store — when services with signals are no longer enough.
6. **SSR and hydration**, `@defer`, performance budgets.
7. **UI:** Angular Material + CDK, accessibility audit.
8. **Quality and delivery:** ESLint (`angular-eslint`), e2e with Playwright, Docker, CI/CD.

## Verification (what was actually verified while creating the course)

Environment: Node.js 24.22.2, npm 11.19.1, Angular CLI 22.2.6, Angular 22.2.5, TypeScript 6.0, Vitest 5.1, macOS. Date: 2026-11-10.

| What | Command | Result |
|----|---------|-----------|
| Workspace creation | `npx @angular/cli@22 new parcelflow-lite --directory app …` | success |
| End-of-Day-1 state | `ng build`, `ng test --no-watch` | build OK, 2 tests passed |
| End-of-Day-2, Day 3, Day 4 state | `ng build` | OK |
| Final state of `app/` | `ng build` | OK; lazy chunks `shipment-form`, `shipment-form-reactive` |
| Final state of `app/` | `ng test --no-watch --no-progress` | 4 files, 11 tests passed |
| Dev server | `ng serve` + HTTP requests | `/shipments/2` → 200, `/data/shipments.json` → JSON, non-existent fixture → 404 |
| Rendering of the list, filter, details, "not found" | temporary test with `RouterTestingHarness` in a copy of the project | passed |
| Final challenge solution (Required + Stretch) | `ng test`, `ng build` in a copy of the project | 13 tests passed, build OK |
| Lesson claims: `NG0950`, behavior of a plain field without a signal, `[innerHTML]` sanitization, output typing | temporary tests / build in a copy of the project | confirmed |

**Not verified:**

- Intermediate states **within** a day (after an individual lesson) were not built separately — only the states at the end of Day 1–4 and the final one.
- The solutions to the Try it yourself blocks (`exercises/solutions/en/day-0N.md`) were written without separate compilation, except for the final challenge.
- The application was not run manually in a real browser: its behavior was verified with unit tests in jsdom, the build and requests to the dev server.
- The `ng new … --directory practice` command itself was not run (its equivalent with `--directory app` was run).
