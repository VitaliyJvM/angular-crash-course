# Day 3 · Lesson 2 — DI: provider scopes and comparison with Spring

**English** | [Українська](../../../uk/lessons/day-03-services-http/02-di-scopes-vs-spring.md)

**Estimated time:** 5 min · **Time budget:** read 2 · code 2 · try 0.5 · verify 0.5

**Learning outcome:** explain the three provider levels in Angular and how Angular DI differs from Spring IoC.

[← Previous: Services and inject(): ShipmentStore](01-services-and-inject.md) · [Course plan](../../COURSE-PLAN.md) · [Next: HttpClient: GET from a JSON fixture →](03-httpclient-get-fixture.md)

## Why it matters

Where a service is "provided" determines how many instances of it exist and when they are destroyed. Getting the scope wrong is a typical cause of "the state is not shared for some reason" or "the state does not reset for some reason".

## Concept

Injectors form a hierarchy; `inject()` looks for a provider from the bottom up: component → route → application.

| Scope | How to declare | Instance | Spring analogue (approximate) |
|---|---|---|---|
| Application | `@Service()` / `@Injectable({ providedIn: 'root' })` / `providers` in `app.config.ts` | one per application | singleton bean |
| Route | `providers: [...]` in the `Route` object | one per route branch | — |
| Component | `providers: [...]` in `@Component` | a new one for each component instance, destroyed together with it | very loosely prototype / request scope |

```ts
@Component({ providers: [ShipmentStore] /* its own instance for this component and its children */ })
```

Where the Spring analogy falls short:

- there is no classpath scanning — a provider is either auto-provided (`@Service()`) or listed explicitly in `providers`;
- auto-provided services are tree-shakable: if nobody injects one, its code does not end up in the bundle;
- resolution happens at runtime along the injector tree, not once at context startup;
- `inject()` works only in an injection context (field initializer, constructor, factory), not in an arbitrary callback;
- `@Service({ autoProvided: false })` requires an explicit provider — you choose the scope yourself.

For values without a class (config, URL) you use an `InjectionToken`: `const API_URL = new InjectionToken<string>('API_URL')` + `{ provide: API_URL, useValue: '/api' }` — the analogue of `@Value` / `@Qualifier`. React parallel: a component-level provider ≈ a `<Context.Provider>` around a subtree.

## Follow along

1. In `shipment-store.ts` temporarily add `constructor() { console.log('ShipmentStore created'); }` to the class. Refresh the page — there is one line in the console: an app-wide singleton, created lazily on the first `inject()`.
2. In the `@Component` of the `ShipmentList` class temporarily add `providers: [ShipmentStore]`. The application works the same way and the console again shows one line — but now it is a component-level instance: it will disappear together with `ShipmentList`, and another page would get its own.
3. Remove `providers: [ShipmentStore]` and the `constructor` with `console.log`. The code must be back to its state after Lesson 1.

## Try it yourself

Without running the code, answer this: if you add `providers: [ShipmentStore]` to the `@Component` of the `ShipmentCard` class and call `inject(ShipmentStore)` there, how many times will `ShipmentStore created` appear for a list of 5 shipments, and why? (You can check your answer in `exercises/solutions/en/day-03.md`.)

## Verify / Expected result

- After step 3, `git diff` (or looking through the files) shows no changes relative to Lesson 1.
- The application works and there is no `ShipmentStore created` in the console.

## Common mistake / Best practice

**Pitfall:** adding `providers: [SomeStore]` to a component "just in case". The component gets a separate instance, and shared state silently stops being shared.

**Do this instead:** app-wide by default (`@Service()`); component/route scope only deliberately, when the state must live and die together with the component or the feature.

## Interview checkpoint

**Q: How does Angular decide which instance of a service to inject?**

A: Injectors are hierarchical. Angular starts at the requesting component's injector and walks up through parent components, then route and application injectors, and uses the first provider it finds. So a root-provided service is a singleton, while a service listed in a component's `providers` gets a new instance per component instance.

**Q: How does Angular DI compare to Spring?**

A: Same idea — inversion of control with singleton services by default. But Angular's injectors form a runtime tree tied to the component tree, providers are tree-shakable, there is no classpath scanning, and scopes are defined by where you provide the service rather than by a scope annotation.

## Done when

- [ ] You can name the three provider levels and the instance lifetime at each one.
- [ ] You can name at least two differences between Angular DI and Spring IoC.
- [ ] The temporary changes from Follow along are removed.

---
Docs: [Defining dependency providers](https://angular.dev/guide/di/defining-dependency-providers) · [Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection) · [Injection context](https://angular.dev/guide/di/dependency-injection-context)

[← Previous: Services and inject(): ShipmentStore](01-services-and-inject.md) · [Next: HttpClient: GET from a JSON fixture →](03-httpclient-get-fixture.md)
