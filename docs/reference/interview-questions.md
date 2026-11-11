# Angular interview questions — quick review

Короткі відповіді англійською, які реально озвучити за 20–40 секунд. Теорія — в уроках; тут лише повторення. Спосіб роботи: закрий відповідь, скажи свою вголос, порівняй.

## Architecture & fundamentals

**1. What is Angular and how does it differ from React?**
Angular is a full TypeScript framework with a built-in router, forms, HTTP client, dependency injection and CLI. React is a UI library where you assemble those pieces yourself. Angular trades flexibility for consistency across teams.

**2. How does an Angular app bootstrap?**
`index.html` contains the root selector; `main.ts` calls `bootstrapApplication` with the root component and an application config that holds global providers. Angular creates the root component and renders its template.

**3. What is a standalone component? What were NgModules for?**
A standalone component declares its own template dependencies in `imports`. NgModules used to group components and configure compilation context and providers; they are still supported but no longer needed for new code.

**4. What is the difference between a component and a directive?**
A component is a directive with a template. Attribute directives change the behavior or appearance of an existing element without their own view.

**5. What is a pipe?**
A pure function used in templates to transform a value for display, such as `date` or `currency`. Pure pipes re-run only when their input changes.

**6. What is AOT compilation?**
Templates are compiled to JavaScript at build time, so errors are caught early, bundles are smaller and the browser does not need the compiler.

## Templates & components

**7. What kinds of data binding exist?**
Interpolation for text, property binding with square brackets, event binding with parentheses, and two-way binding which combines the two.

**8. How do `@if` and `@for` differ from `*ngIf` and `*ngFor`?**
They are built-in template syntax rather than directives: no imports, better type narrowing, `@else` and `@empty` blocks, and `@for` requires `track`, which makes list updates efficient.

**9. Why is `track` required in `@for`?**
It gives each item a stable identity so Angular can reuse DOM nodes when the list changes instead of re-creating them. Track by a unique id, not by index, for dynamic lists.

**10. How do components communicate?**
Parent to child through inputs, child to parent through outputs, and unrelated components through a shared service. Signal-based `input()` and `output()` are the modern API; `@Input()` and `@Output()` decorators are the older equivalent.

**11. What are presentational and container components?**
Presentational components only receive inputs and emit outputs; container (smart) components talk to services and manage state. The split keeps UI pieces reusable and easy to test.

**12. Which lifecycle hooks do you use most?**
`ngOnInit` for initialization, `ngOnDestroy` or `DestroyRef` for cleanup, and `afterNextRender` for DOM work. With signal inputs and `computed`, `ngOnChanges` is rarely needed.

## Signals & change detection

**13. What is a signal?**
A reactive value container. Reading it in a template or a `computed` registers a dependency, and writing to it notifies exactly those consumers.

**14. `signal` vs `computed` vs `effect`?**
`signal` holds writable state, `computed` derives read-only memoized values from other signals, and `effect` runs side effects when dependencies change. Use `computed` for state, `effect` only for things like logging or syncing with non-Angular APIs.

**15. How do signals compare to React hooks?**
`signal` is like `useState` and `computed` like `useMemo`, but dependencies are tracked automatically, signals can live outside components, and a change updates only the dependent bindings instead of re-running the component function.

**16. How does change detection work in modern Angular?**
Apps are zoneless by default: Angular is notified by signal changes, template events, the async pipe or `markForCheck`. Components use OnPush by default in v22, so a component is checked only when something it depends on changed.

**17. What was zone.js and what does OnPush mean in legacy code?**
zone.js patched async browser APIs so Angular could run change detection after any async event and check the whole tree. OnPush limited checks to components whose inputs changed by reference or that were explicitly marked dirty.

**18. Why must signal state be updated immutably?**
Signals compare by reference. Mutating an array in place keeps the same reference, so consumers are not notified and the view does not update.

## Services, DI & HTTP

**19. What is dependency injection in Angular?**
A built-in mechanism where classes declare dependencies and injectors provide the instances. It decouples components from construction details and makes testing easy because providers can be replaced.

**20. What provider scopes exist?**
Application-wide singletons via `@Service()` or `providedIn: 'root'`, route-level providers, and component-level providers that create one instance per component instance. Injectors are hierarchical, so the nearest provider wins.

**21. `inject()` vs constructor injection?**
Both resolve dependencies from the current injector. `inject()` works in field initializers and functions such as guards and interceptors, gives better type inference, and is the recommended style; constructor injection is common in older code.

**22. How does Angular DI compare to Spring?**
Both are IoC containers with singletons by default. Angular's injectors form a tree tied to the component and route hierarchy, providers are tree-shakable, and resolution happens at runtime in the browser rather than through classpath scanning.

**23. How does `HttpClient` work?**
Its methods return cold Observables: the request is sent on subscription, emits one typed response and completes. It supports interceptors, typed responses and dedicated testing utilities.

**24. How do you handle HTTP errors and loading state?**
Track loading and error alongside the data — in a store with signals or with `httpResource` — and render explicit loading, error, empty and content states. Cross-cutting concerns such as auth headers or global error handling go into interceptors.

**25. What is an interceptor?**
A function that sees every outgoing request and incoming response, typically used for auth tokens, logging, retries or error mapping.

## RxJS

**26. Observable vs Promise?**
A Promise is eager and resolves once. An Observable is lazy, can emit many values over time, is cancellable through unsubscription, and composes with operators.

**27. How do you prevent subscription leaks?**
Avoid manual subscriptions when possible: use `toSignal` or the async pipe, which unsubscribe automatically. For manual ones use `takeUntilDestroyed`. HTTP calls complete on their own.

**28. When do you use signals and when RxJS?**
Signals for synchronous state and derived values in the UI. RxJS for events over time — debouncing, cancellation, websockets, combining streams. `toSignal` and `toObservable` bridge the two.

**29. `switchMap` vs `mergeMap`?**
`switchMap` cancels the previous inner request when a new value arrives, which suits search-as-you-type. `mergeMap` runs them in parallel and keeps all results.

## Routing

**30. How do you define routes and lazy-load them?**
Routes are an array of path-to-component mappings passed to `provideRouter`. `loadComponent` or `loadChildren` with a dynamic import puts that code in a separate chunk loaded on first navigation.

**31. How do you read route parameters?**
With `withComponentInputBinding`, parameters bind directly to component inputs. Otherwise inject `ActivatedRoute` and read `snapshot.paramMap` or subscribe to `paramMap` when the same component instance is reused.

**32. What are guards and resolvers?**
Guards decide whether a navigation may proceed, for example `canActivate` for authentication. Resolvers load data before the route activates. Guards improve UX; real authorization must be enforced on the server.

## Forms

**33. Which form approaches does Angular have?**
Signal Forms, stable since v22, where a writable signal model is the source of truth and validation is a schema; Reactive Forms with an explicit `FormGroup`/`FormControl` tree and Observables; and template-driven forms based on `ngModel` for simple cases.

**34. Which would you pick?**
Signal Forms for new signal-based apps on v22 or later. Reactive Forms when working in an existing codebase that already uses them — which is most enterprise code. Template-driven only for trivial forms.

**35. How do you write a custom validator?**
In Signal Forms with `validate(path, ctx => error or null)` inside the schema; in Reactive Forms as a `ValidatorFn` that receives the control and returns an errors object or null. Client-side validation is UX only; the server must validate again.

## Testing & quality

**36. How do you unit test in Angular?**
The CLI sets up Vitest. `TestBed` creates an injector and components for the test, `HttpTestingController` mocks HTTP, inputs are set through `componentRef.setInput`, and `fixture.whenStable()` waits for rendering.

**37. How do you test a service that uses `HttpClient`?**
Provide `provideHttpClientTesting`, call the method, then use `HttpTestingController.expectOne(url).flush(data)` to answer the request and assert on the resulting state. `verify()` ensures no unexpected requests remain.

**38. How does Angular protect against XSS?**
Interpolated values are escaped and values bound to `innerHTML` are sanitized. The risk comes from bypassing this with `bypassSecurityTrust*` on untrusted data.

**39. What are common Angular performance practices?**
Lazy-load routes, use signals and `computed` instead of method calls in templates, provide a stable `track` in `@for`, use `@defer` for heavy blocks, and keep bundles within budgets.

**40. What would you do differently in a production version of ParcelFlow Lite?**
Add a real backend with POST and server-side validation, interceptors for auth and errors, route guards, a shared UI layer, e2e tests, and CI with lint, tests and build budgets.
