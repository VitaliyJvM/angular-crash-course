# Angular Crash Course for Experienced Developers

**English** | [Українська](README.uk.md)

A hands-on Angular 22 course for developers who already build software for a living: **5 days, 60 minutes a day, 30 short lessons**. You build a small shipment-tracking application from scratch and, along the way, prepare for typical Angular technical interview questions.

The course is available in English and Ukrainian with the same content. Both versions share one Angular application.

## Who this is for

Developers who are comfortable with TypeScript and have worked with React, or with a backend stack such as Java and Spring Boot, and now need a systematic, fast introduction to Angular.

The course does **not** explain JavaScript or TypeScript, HTML and CSS, Git, HTTP, `async`/`await` or OOP. Instead, new Angular concepts are mapped to what you already know: JSX and Angular templates, props and `input()`, hooks and signals, React context and Angular services, Spring beans and Angular dependency injection.

### Prerequisites

| What | Version | Check |
|------|---------|-------|
| Node.js | `^22.22.3`, `^24.15.0` or `>=26` | `node -v` |
| npm | 8+ (tested with 11) | `npm -v` |
| Angular CLI | 22.x, run through `npx`; no global install needed | — |
| Editor | any; enable the Angular Language Service in VS Code or WebStorm | — |

## What you will learn

After the five hours you should be able to:

- explain Angular's architecture and how it differs from React;
- create a workspace with the Angular CLI and find your way around its files;
- build standalone components with templates, `@if` / `@for`, `input()` and `output()`;
- manage state with `signal()` and `computed()`, and explain change detection, OnPush and zoneless;
- move logic into services, use `inject()` and reason about provider scopes;
- load typed data with `HttpClient` and handle loading, error and empty states;
- decide when to use signals and when RxJS, and connect the two safely;
- add routes, route parameters and lazy loading with the Angular Router;
- build a validated form with Signal Forms, and explain Reactive and template-driven forms;
- write unit tests for a service and a component with Vitest and `TestBed`;
- answer common Angular interview questions out loud.

## Course structure

Each day is one module of exactly 60 minutes. Lessons take 5, 10 or 15 minutes, and that time includes reading, coding, the exercise and the check.

| Day | Module | Lessons | Minutes |
|-----|--------|---------|---------|
| 1 | Angular Fundamentals & Project Structure | 6 | 60 |
| 2 | Components, Templates & State | 6 | 60 |
| 3 | Services, DI & Data Loading | 6 | 60 |
| 4 | Router & Forms | 5 | 60 |
| 5 | Quality, Best Practices & Interview | 7 | 60 |
| | **Total** | **30** | **300** |

Every lesson follows the same template: **Why it matters → Concept → Follow along → Try it yourself → Verify → Common mistake → Interview checkpoint → Done when**.

The full plan with timings and outcomes is in [docs/en/COURSE-PLAN.md](docs/en/COURSE-PLAN.md).

## All 30 lessons

### Day 1 — Angular Fundamentals & Project Structure

| # | Lesson | Min |
|---|--------|-----|
| 1.1 | [Angular vs React: mental model](docs/en/lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) | 5 |
| 1.2 | [Angular CLI and workspace setup](docs/en/lessons/day-01-fundamentals/02-cli-and-workspace-setup.md) | 15 |
| 1.3 | [Workspace tour: from `angular.json` to `App`](docs/en/lessons/day-01-fundamentals/03-workspace-tour.md) | 10 |
| 1.4 | [First component: `ShipmentList`](docs/en/lessons/day-01-fundamentals/04-first-component.md) | 15 |
| 1.5 | [Template bindings](docs/en/lessons/day-01-fundamentals/05-template-bindings.md) | 10 |
| 1.6 | [NgModules vs Standalone](docs/en/lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) | 5 |

### Day 2 — Components, Templates & State

| # | Lesson | Min |
|---|--------|-----|
| 2.1 | [Typed model, `@for` and `@if`](docs/en/lessons/day-02-components-state/01-typed-model-and-control-flow.md) | 10 |
| 2.2 | [`signal()` and events: status filter](docs/en/lessons/day-02-components-state/02-signals-and-events.md) | 10 |
| 2.3 | [`computed()`: derived state and counters](docs/en/lessons/day-02-components-state/03-computed-derived-state.md) | 10 |
| 2.4 | [`input()`: the `ShipmentCard` component](docs/en/lessons/day-02-components-state/04-input-child-component.md) | 10 |
| 2.5 | [`output()`: child-to-parent events](docs/en/lessons/day-02-components-state/05-output-child-to-parent.md) | 10 |
| 2.6 | [Lifecycle, change detection, OnPush and zoneless](docs/en/lessons/day-02-components-state/06-lifecycle-and-change-detection.md) | 10 |

### Day 3 — Services, DI & Data Loading

| # | Lesson | Min |
|---|--------|-----|
| 3.1 | [Services and `inject()`: `ShipmentStore`](docs/en/lessons/day-03-services-http/01-services-and-inject.md) | 10 |
| 3.2 | [DI: provider scopes and comparison with Spring](docs/en/lessons/day-03-services-http/02-di-scopes-vs-spring.md) | 5 |
| 3.3 | [`HttpClient`: GET from a JSON fixture](docs/en/lessons/day-03-services-http/03-httpclient-get-fixture.md) | 15 |
| 3.4 | [Loading / error / empty states](docs/en/lessons/day-03-services-http/04-loading-error-empty-states.md) | 10 |
| 3.5 | [Observable basics and safe subscriptions: debounced search](docs/en/lessons/day-03-services-http/05-observables-and-interop.md) | 15 |
| 3.6 | [Signals vs RxJS: when to use which](docs/en/lessons/day-03-services-http/06-signals-vs-rxjs.md) | 5 |

### Day 4 — Router & Forms

| # | Lesson | Min |
|---|--------|-----|
| 4.1 | [Routes and navigation](docs/en/lessons/day-04-routing-forms/01-routes-and-navigation.md) | 10 |
| 4.2 | [Route parameters: the `ShipmentDetails` page](docs/en/lessons/day-04-routing-forms/02-route-params-details.md) | 15 |
| 4.3 | [Signal Forms: the create-shipment form](docs/en/lessons/day-04-routing-forms/03-signal-forms-basics.md) | 15 |
| 4.4 | [Validation, error messages and submit](docs/en/lessons/day-04-routing-forms/04-validation-and-submit.md) | 10 |
| 4.5 | [Signal Forms vs Reactive Forms vs template-driven](docs/en/lessons/day-04-routing-forms/05-forms-comparison-reactive.md) | 10 |

### Day 5 — Quality, Best Practices & Interview

| # | Lesson | Min |
|---|--------|-----|
| 5.1 | [Unit testing a service: `ShipmentStore`](docs/en/lessons/day-05-quality-interview/01-testing-a-service.md) | 10 |
| 5.2 | [Unit testing a component: `ShipmentCard`](docs/en/lessons/day-05-quality-interview/02-testing-a-component.md) | 10 |
| 5.3 | [Production structure and common mistakes](docs/en/lessons/day-05-quality-interview/03-production-structure-and-mistakes.md) | 5 |
| 5.4 | [Accessibility and security basics](docs/en/lessons/day-05-quality-interview/04-accessibility-and-security.md) | 5 |
| 5.5 | [Angular vs React: decision guide](docs/en/lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md) | 5 |
| 5.6 | [Final challenge: deleting a shipment](docs/en/lessons/day-05-quality-interview/06-final-challenge.md) | 15 |
| 5.7 | [Interview review](docs/en/lessons/day-05-quality-interview/07-interview-review.md) | 10 |

## The learning application: ParcelFlow Lite

ParcelFlow Lite is a small shipment-tracking app with no backend. By the end of the course it has:

- a shipment list loaded over HTTP from a local JSON fixture, with loading, error and empty states;
- a status filter, a debounced search by tracking number and derived counters;
- a details page per shipment with its tracking events;
- a form that creates a shipment in memory, with required, pattern and duplicate validation;
- unit tests for the store, the card component and the form.

The domain model is deliberately small: `Shipment` (`id`, `trackingNumber`, `carrier`, `status`, `createdAt`) and `TrackingEvent`.

## Repository layout

```
├── README.md              ← you are here
├── README.uk.md           ← Ukrainian version
├── docs/
│   ├── en/
│   │   ├── COURSE-PLAN.md ← all lessons, timings, outcomes
│   │   ├── PROGRESS.md    ← progress checklist, self-assessment, next steps
│   │   ├── lessons/       ← day-01-fundamentals/ … day-05-quality-interview/
│   │   └── reference/     ← cheat sheets and interview questions
│   └── uk/                ← the same course in Ukrainian
├── exercises/solutions/
│   ├── en/                ← exercise solutions (do not read ahead)
│   └── uk/
├── app/                   ← reference implementation of ParcelFlow Lite (final state), shared by both languages
└── practice/              ← YOUR workspace; you create it on Day 1 (not in the repository)
```

### Why there are two workspaces

You build the project **from scratch**, and the repository also ships **working code** to compare against:

- `practice/` is your own Angular workspace. You create it with `ng new` in lesson 1.2 and extend it lesson by lesson. The folder is listed in `.gitignore`.
- `app/` is the reference: the state of the project after Day 5, **without** the final challenge. Use it to compare your code, copy the JSON fixture or run the finished app. Do not edit it while you study.

## Running the application

```bash
cd app
npm install
npm start          # ng serve → http://localhost:4200
```

Other commands, from `app/` or from your own `practice/`:

```bash
npx ng test --no-watch     # unit tests (Vitest + jsdom), single run
npx ng test                # unit tests in watch mode
npx ng build               # production build into dist/
```

## How to follow the course

1. Skim the [course plan](docs/en/COURSE-PLAN.md).
2. Start with [Day 1 · Lesson 1](docs/en/lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) and work through one `docs/en/lessons/day-0N-*/` module per day. Every lesson links to the previous and the next one, and to the same lesson in the other language.
3. In each lesson, read **Concept**, do **Follow along** in your `practice/` workspace, then **Try it yourself** and **Verify**. Say the answers in **Interview checkpoint** out loud.
4. Code blocks in **Follow along** are meant to be copied. The timings do not assume you type everything by hand.
5. Track your progress in [PROGRESS.md](docs/en/PROGRESS.md).
6. Keep a timer. If a lesson overruns, note where you stopped and move on; you can always compare your workspace with `app/`.

### Exercises and solutions

- Do **Try it yourself** on your own first. Lessons give hints, not answers.
- Open `exercises/solutions/en/day-0N.md` only after your own attempt, or when you have been stuck for more than a few minutes.
- Open `exercises/solutions/en/final-challenge.md` only after lesson 5.6.
- `app/` contains the result of every **Follow along** step. It does not contain the Try it yourself results or the final challenge.

## Technology

Angular 22.2 · Angular CLI 22.2 · TypeScript 6.0 · RxJS 7.8 · Vitest 5 with jsdom. No UI library and no dependencies beyond what `ng new` installs.

The course uses the current recommended style: standalone components, `inject()`, signals, built-in control flow, `@Service()`, Signal Forms, zoneless change detection. Older patterns you will meet in existing codebases (NgModules, `*ngIf`, `@Input()`, `@Injectable({ providedIn: 'root' })`, zone.js, Reactive Forms) are explained where they matter for reading legacy code and for interviews. Supported version combinations are listed at <https://angular.dev/reference/versions>.

## Interview preparation

- Every lesson ends with an **Interview checkpoint**: one or two questions with a short answer you can say out loud.
- [Interview questions](docs/en/reference/interview-questions.md): 40 questions with concise answers, grouped by topic.
- [Angular vs React cheat sheet](docs/en/reference/angular-vs-react.md): a side-by-side comparison and guidance on when to choose which.
- [Angular cheat sheet](docs/en/reference/angular-cheatsheet.md): the syntax and APIs used in the course.
- [Project structure](docs/en/reference/project-structure.md): the layout of the app and who is responsible for what.
- [Lesson 5.7](docs/en/lessons/day-05-quality-interview/07-interview-review.md): a rapid-fire review, and a self-assessment table in [PROGRESS.md](docs/en/PROGRESS.md).

## Limitations

- **There is no backend.** `public/data/shipments.json` is a static file served by the dev server. HTTP GET works; POST, PUT and DELETE would not persist anything.
- Creating a shipment and "Mark delivered" change state in browser memory only. The changes **disappear when you reload the page**.
- Five hours is enough for a working foundation, not for depth. NgRx, SSR, authentication, route guards, advanced RxJS, Docker and CI/CD are out of scope and listed as next steps.
- The course targets Angular 22. CLI output and recommended APIs change between major versions, so newer versions may generate different files.
- The reference app was verified with a production build and unit tests in jsdom. The state at the end of each day was built, but the state after each individual lesson was not, and most Try it yourself solutions were not compiled separately. The "Verification" section of [PROGRESS.md](docs/en/PROGRESS.md) lists exactly what was and was not checked.

## Links

- [Course plan](docs/en/COURSE-PLAN.md) · [Progress checklist](docs/en/PROGRESS.md)
- Lessons: [Day 1](docs/en/lessons/day-01-fundamentals/) · [Day 2](docs/en/lessons/day-02-components-state/) · [Day 3](docs/en/lessons/day-03-services-http/) · [Day 4](docs/en/lessons/day-04-routing-forms/) · [Day 5](docs/en/lessons/day-05-quality-interview/)
- [Reference materials](docs/en/reference/) · [Solutions](exercises/solutions/en/README.md)
- [Українська версія](README.uk.md)

## License

This repository uses two licenses:

- **Code** (the Angular application in `app/` and the code examples in the lessons) is licensed under the [MIT License](LICENSE).
- **Educational content** (lessons, explanations, reference materials and documentation, in English and Ukrainian) is licensed under [CC BY 4.0](LICENSE-CONTENT.md): you may share and adapt it, including commercially, as long as you give appropriate credit.

Third-party dependencies, such as Angular and RxJS, remain under their own licenses.
