# COURSE-PLAN — Angular Crash Course for Experienced Developers

**English** | [Українська](../uk/COURSE-PLAN.md)

5 days · 30 lessons · **300 minutes** (exactly 60 min per day). The time for each lesson includes reading, typing the code, running it, the exercise, verification and the interview checkpoint.

Verified technical baseline (2026-11-10): Angular **22.2**, Angular CLI 22.2.6, TypeScript 6.0, Node.js 24 (supported: `^22.22.3 || ^24.15.0 || >=26`), RxJS 7.8, Vitest 5 + jsdom.

## Day 1 — Angular Fundamentals & Project Structure

| # | Topic | Min | Practical outcome | File |
|---|------|----|----------------------|------|
| 1.1 | Angular vs React: mental model | 5 | You can name 5 architectural differences between Angular and React | [01](lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) |
| 1.2 | Angular CLI and workspace setup | 15 | Your own `practice/` workspace is created and running on `localhost:4200` | [02](lessons/day-01-fundamentals/02-cli-and-workspace-setup.md) |
| 1.3 | Workspace tour: from `angular.json` to `App` | 10 | You have traced the path `index.html → main.ts → app.config.ts → App` | [03](lessons/day-01-fundamentals/03-workspace-tour.md) |
| 1.4 | First component: `ShipmentList` | 15 | A feature component is generated and rendered in `App` | [04](lessons/day-01-fundamentals/04-first-component.md) |
| 1.5 | Template bindings | 10 | Interpolation, property binding, class binding and event binding work on a button | [05](lessons/day-01-fundamentals/05-template-bindings.md) |
| 1.6 | NgModules vs Standalone | 5 | You can explain what NgModules were for and how to read legacy code | [06](lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) |
| | **Total Day 1** | **60** | | |

## Day 2 — Components, Templates & State

| # | Topic | Min | Practical outcome | File |
|---|------|----|----------------------|------|
| 2.1 | Typed model, `@for` and `@if` | 10 | A list of shipments from typed mock data | [01](lessons/day-02-components-state/01-typed-model-and-control-flow.md) |
| 2.2 | `signal()` and events: status filter | 10 | Filter buttons change state held in a signal | [02](lessons/day-02-components-state/02-signals-and-events.md) |
| 2.3 | `computed()`: derived state and counters | 10 | Filtered list and counters via `computed` | [03](lessons/day-02-components-state/03-computed-derived-state.md) |
| 2.4 | `input()`: the `ShipmentCard` component | 10 | The card is extracted into a presentational component | [04](lessons/day-02-components-state/04-input-child-component.md) |
| 2.5 | `output()`: child-to-parent events | 10 | "Mark delivered" in the card updates the list and the counters | [05](lessons/day-02-components-state/05-output-child-to-parent.md) |
| 2.6 | Lifecycle, change detection, OnPush and zoneless | 10 | You can explain when Angular re-renders a component | [06](lessons/day-02-components-state/06-lifecycle-and-change-detection.md) |
| | **Total Day 2** | **60** | | |

## Day 3 — Services, DI & Data Loading

| # | Topic | Min | Practical outcome | File |
|---|------|----|----------------------|------|
| 3.1 | Services and `inject()`: `ShipmentStore` | 10 | Shipment state is moved from the component into a service | [01](lessons/day-03-services-http/01-services-and-inject.md) |
| 3.2 | DI: provider scopes and comparison with Spring | 5 | You can explain the injector levels and the differences from Spring DI | [02](lessons/day-03-services-http/02-di-scopes-vs-spring.md) |
| 3.3 | `HttpClient`: GET from a JSON fixture | 15 | Data is loaded from `public/data/shipments.json`, the response is typed | [03](lessons/day-03-services-http/03-httpclient-get-fixture.md) |
| 3.4 | Loading / error / empty states | 10 | The UI correctly shows all four states, with Retry | [04](lessons/day-03-services-http/04-loading-error-empty-states.md) |
| 3.5 | Observable basics and safe subscriptions: debounced search | 15 | Search by tracking number via `toObservable → debounceTime → toSignal` | [05](lessons/day-03-services-http/05-observables-and-interop.md) |
| 3.6 | Signals vs RxJS: when to use which | 5 | You can justify choosing a signal or an Observable | [06](lessons/day-03-services-http/06-signals-vs-rxjs.md) |
| | **Total Day 3** | **60** | | |

## Day 4 — Router & Forms

| # | Topic | Min | Practical outcome | File |
|---|------|----|----------------------|------|
| 4.1 | Routes and navigation | 10 | `/shipments` works through `<router-outlet>`, with a nav | [01](lessons/day-04-routing-forms/01-routes-and-navigation.md) |
| 4.2 | Route parameters: the `ShipmentDetails` page | 15 | `/shipments/:id` shows details and tracking events | [02](lessons/day-04-routing-forms/02-route-params-details.md) |
| 4.3 | Signal Forms: the create-shipment form | 15 | The form at `/shipments/new` adds a shipment in memory | [03](lessons/day-04-routing-forms/03-signal-forms-basics.md) |
| 4.4 | Validation, error messages and submit | 10 | `required`, `pattern`, a custom validator and accessible messages | [04](lessons/day-04-routing-forms/04-validation-and-submit.md) |
| 4.5 | Signal Forms vs Reactive Forms vs template-driven | 10 | A compact Reactive Forms version + you can compare the three approaches | [05](lessons/day-04-routing-forms/05-forms-comparison-reactive.md) |
| | **Total Day 4** | **60** | | |

## Day 5 — Quality, Best Practices & Interview

| # | Topic | Min | Practical outcome | File |
|---|------|----|----------------------|------|
| 5.1 | Unit testing a service: `ShipmentStore` | 10 | A test with `HttpTestingController` passes in Vitest | [01](lessons/day-05-quality-interview/01-testing-a-service.md) |
| 5.2 | Unit testing a component: `ShipmentCard` | 10 | An input/output/DOM test passes | [02](lessons/day-05-quality-interview/02-testing-a-component.md) |
| 5.3 | Production structure and common mistakes | 5 | Your own code is checked against the list of common mistakes | [03](lessons/day-05-quality-interview/03-production-structure-and-mistakes.md) |
| 5.4 | Accessibility and security basics | 5 | You have walked through the application with the keyboard; you know the limits of frontend security | [04](lessons/day-05-quality-interview/04-accessibility-and-security.md) |
| 5.5 | Angular vs React: decision guide | 5 | A 60-second answer to "When would you choose Angular?" | [05](lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md) |
| 5.6 | Final challenge: deleting a shipment | 15 | `remove` + output + unit test added on your own | [06](lessons/day-05-quality-interview/06-final-challenge.md) |
| 5.7 | Interview review | 10 | 10 rapid-fire questions answered aloud | [07](lessons/day-05-quality-interview/07-interview-review.md) |
| | **Total Day 5** | **60** | | |

## Time check

| Day | Lessons | Minutes |
|------|--------|--------|
| Day 1 | 6 | 5 + 15 + 10 + 15 + 10 + 5 = **60** |
| Day 2 | 6 | 10 × 6 = **60** |
| Day 3 | 6 | 10 + 5 + 15 + 10 + 15 + 5 = **60** |
| Day 4 | 5 | 10 + 15 + 15 + 10 + 10 = **60** |
| Day 5 | 7 | 10 + 10 + 5 + 5 + 5 + 15 + 10 = **60** |
| **Total** | **30** | **300** |

## Scope decisions (trade-offs)

- **The main forms path is Signal Forms**; Reactive Forms get a compact working example, and template-driven forms only a fragment to read. The reasoning is in lesson 4.5.
- **Data: `HttpClient` + a signal-based store**, not `httpResource`: the application needs in-memory changes on top of the loaded data, and `HttpClient`/Observable is what every enterprise codebase has. `httpResource` is shown as an overview in 3.6.
- **No backend.** The JSON fixture is served by the dev server; only GET works. Adding a shipment and "Mark delivered" live in memory and disappear after a reload.
- **Tests only on Day 5** (components are generated with `--skip-tests`), so that the first days are not spent maintaining generated spec files.
- The stretch part of the final challenge and everything marked **Optional / Outside 5-hour course** is not included in the 300 minutes.

## Outside the course (Optional / Outside 5-hour course)

NgRx / SignalStore, SSR and hydration, interceptors and auth (Keycloak/OIDC), route guards/resolvers, advanced RxJS, `httpResource`/`resource`, a real Spring Boot backend, Docker, CI/CD, Angular Material/CDK, e2e tests.
