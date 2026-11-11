# Angular vs React — cheat sheet

**English** | [Українська](../../uk/reference/angular-vs-react.md)

A concise cheat sheet for review and interviews. It compares Angular 22 with modern React (function components + hooks). Neither column is "better" — these are different trade-offs.

## 1. Framework vs library/ecosystem

| | Angular | React |
|---|---|---|
| What it is | a complete framework from a single team | a UI library + ecosystem |
| In the box | router, forms, HTTP client, DI, i18n, CLI, test setup | rendering and component state |
| Rest of the stack | already chosen | chosen by the team: React Router / Next.js, React Hook Form, TanStack Query, Zustand / Redux… |
| Updates | synchronized major releases twice a year, `ng update` with automatic migrations | each library is updated separately |

## 2. Architecture and conventions

| | Angular | React |
|---|---|---|
| Project structure | defined by the CLI and the style guide; projects look alike | arbitrary; depends on the team or the meta-framework |
| Language | TypeScript is mandatory, strict templates | TypeScript is typical but optional |
| Separation of concerns | component (view) / service (logic, data) / routes / config | components + hooks; layers are by convention |
| Declarative configuration | decorators (`@Component`, `@Service`) and `provide*()` | code and props |

## 3. Component model / templates

| Concept | Angular | React |
|---|---|---|
| Component | a class + `@Component`, created once | a function, executed on every render |
| View | HTML template, compiled ahead of time | JSX — JavaScript expressions |
| Conditional / loop | `@if` / `@for (…; track id)` | `&&`, ternary operator / `.map()` with `key` |
| Input data | `input()`, `input.required<T>()` | props |
| Events upward | `output<T>()` + `(event)="…"` | callback props |
| Two-way | `model()` + `[(value)]` | value + onChange by hand |
| Nested content | `<ng-content>` | `children` |
| Styles | scoped to the component by default | CSS Modules, CSS-in-JS, etc. |
| Reusing behavior on an element | directives | hooks / HOC / wrappers |
| Transformation in the template | pipes (`| date`) | a function call |

Legacy Angular syntax you will come across: `*ngIf`, `*ngFor`, `@Input()`, `@Output()` + `EventEmitter`, `[(ngModel)]`.

## 4. Reactivity, state and change detection

| | Angular | React |
|---|---|---|
| Local state | `signal(value)` → `set` / `update` | `useState` |
| Derived state | `computed(() => …)` — dependencies are tracked automatically, the result is cached | `useMemo(fn, deps)` — dependencies by hand |
| Side effects | `effect()` — a last resort; lifecycle hooks; `afterNextRender` | `useEffect` |
| Update model | fine-grained: the bindings that read the changed signal are updated; default OnPush + zoneless | re-render of the component function and its subtree, then reconciliation |
| Manual optimizations | rarely needed | `memo`, `useMemo`, `useCallback` (or React Compiler) |
| Async streams | RxJS `Observable` + `toSignal` / `async` pipe | promises, libraries (TanStack Query) |
| Global state | services with signals; NgRx / SignalStore when needed | Context, Zustand, Redux Toolkit |

Historical note: before v21 Angular used zone.js by default and checked the whole component tree after every async event; `ChangeDetectionStrategy.OnPush` was enabled by hand. In v22 OnPush is the default, and the old strategy is called `Eager`.

## 5. Dependency injection

| | Angular | React |
|---|---|---|
| Mechanism | built-in hierarchical DI: `@Service()` / `@Injectable()`, `inject()` | no DI; Context + hooks, module imports |
| Scope | application (root), route, component | Context Provider boundaries |
| Substitution in tests | `TestBed` providers | module mocks, Provider wrappers |
| Typical inhabitants | data access, state stores, auth, logging | custom hooks, context values |

For a Spring developer: service ≈ singleton bean, `inject(X)` ≈ `@Autowired`, `InjectionToken` ≈ a qualifier for non-class values. The difference: injectors form a tree, and the scope depends on where the provider is declared.

## 6. Routing / forms / HTTP

| | Angular | React |
|---|---|---|
| Router | `@angular/router`: `Routes`, `<router-outlet>`, `routerLink`, guards, resolvers, lazy `loadComponent` | React Router / TanStack Router / file-based routing in Next.js |
| Route params | `input()` via `withComponentInputBinding()` or `ActivatedRoute` | `useParams()` |
| Programmatic navigation | `inject(Router).navigate([...])` | `useNavigate()` |
| Forms | Signal Forms (v22+), Reactive Forms, template-driven — all built in, with validation | controlled inputs; React Hook Form / Formik + Zod |
| HTTP | `HttpClient` (typed, interceptors, testing utilities), `httpResource` | `fetch` / axios + TanStack Query / SWR |

## 7. Testing and ecosystem

| | Angular | React |
|---|---|---|
| Unit tests | Vitest by default from the CLI (previously Karma + Jasmine), `TestBed`, `HttpTestingController` | Vitest / Jest + React Testing Library |
| E2E | Playwright / Cypress (your choice) | Playwright / Cypress |
| UI kit | Angular Material + CDK (official), PrimeNG | MUI, Ant Design, shadcn/ui, countless others |
| SSR | Angular SSR + hydration (built in) | Next.js, Remix / React Router framework mode |
| Mobile | Ionic, NativeScript | React Native |
| Market and community | smaller, concentrated in enterprise | the largest ecosystem and job market |

## 8. Learning curve and team scaling

| | Angular | React |
|---|---|---|
| Entry barrier | higher: DI, decorators, RxJS, templates, CLI | lower to get started; the complexity comes with choosing the stack |
| Onboarding to a new project | fast — the structure is the same everywhere | depends on the decisions of the particular team |
| Large teams | conventions and DI reduce divergence between teams | you need your own standards and architecture guidelines |
| Flexibility | lower: the "Angular way" | high: any architecture |

## 9. When to choose which

**Angular makes sense when:**
- it is a large, long-lived enterprise application with many teams and forms;
- code uniformity, predictable upgrades and a minimum of stack decisions matter;
- the team comes from Java/C# — DI, classes and layers are familiar to it.

**React makes sense when:**
- you need maximum flexibility or a specific stack (Next.js, React Native, embedding into an existing page);
- it is a small product or team, with fast experiments;
- the widest choice of libraries and candidates matters.

**Both in one organization** is a normal situation: different products with different requirements, micro-frontends, shared TypeScript code and design tokens. For a developer, knowing both is an advantage: the concepts (components, one-way data flow, derived state) are shared, the mechanisms differ.

**What not to say in an interview:** "X is always better/faster than Y". The performance of both is sufficient for most applications; what decides is the team, the requirements and the cost of maintenance.
