# Day 1 · Lesson 6 — NgModules vs Standalone

**English** | [Українська](../../../uk/lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md)

**Estimated time:** 5 min · **Time budget:** read 3 · follow 1 · try/verify 1

**Learning outcome:** you can explain why NgModules existed, how standalone components replaced them, and how to read legacy code.

[← Previous: Template bindings](05-template-bindings.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Typed model, @for and @if →](../day-02-components-state/01-typed-model-and-control-flow.md)

## Why it matters

Most enterprise projects written before 2023 are built on NgModules, and "standalone vs NgModule" is one of the most frequent interview questions. New applications are not built on NgModules.

## Concept

An **NgModule** (the only option before Angular 14) is a class with `@NgModule` that grouped components into a compilation unit: what is declared, what is imported, what is exported, which providers. A component could not exist outside a module.

```ts
// LEGACY: this is what NgModule-based code looks like
@NgModule({
  declarations: [AppComponent, ShipmentListComponent], // components of this module
  imports: [BrowserModule, HttpClientModule],          // other modules
  providers: [ShipmentService],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

A **standalone component** lists its own template dependencies in `imports`; global configuration is done with `provide*()` functions in `app.config.ts`.

| | NgModules (legacy) | Standalone (modern default) |
|---|---|---|
| Template dependencies | the module's `declarations` + `imports` | the component's own `imports` |
| Bootstrap | `bootstrapModule(AppModule)` | `bootstrapApplication(App, appConfig)` |
| Global services | `HttpClientModule`, `RouterModule.forRoot()` | `provideHttpClient()`, `provideRouter()` |
| Lazy loading | `loadChildren` → module | `loadComponent` / `loadChildren` → routes |
| Status | supported, not recommended for new projects | default since Angular 19 (no need to write `standalone: true`) |

Where you still come across NgModules: old applications, some third-party libraries (their module is simply added to the `imports` of a standalone component), and also `FormsModule` / `ReactiveFormsModule` (Day 4). The two approaches can be mixed, so migration happens gradually (`ng generate @angular/core:standalone`).

> Spring parallel: an NgModule is a bit like `@Configuration` + component scan for a part of the application. The analogy is incomplete — an NgModule also defined the visibility scope of components in templates.

## Follow along

1. In `src/app/app.ts`, temporarily remove `ShipmentList` from the `imports` array (keep the ES import) and save.
2. Look at the error in the terminal: `NG8001: 'app-shipment-list' is not a known element`. In the NgModules world the same error would be fixed in the module's `declarations`/`imports` — that is, in a different file.
3. Put `ShipmentList` back into `imports`.

## Try it yourself

Look at the legacy snippet in the Concept block and say which file of a modern project each of the four `@NgModule` keys "moved" to.

## Verify / Expected result

`declarations` → gone (components are standalone); `imports` → the `imports` of each component or `provide*()` in `app.config.ts`; `providers` → `app.config.ts` or the service itself; `bootstrap` → `bootstrapApplication` in `main.ts`. The application builds without errors again.

## Common mistake / Best practice

**Mistake:** creating a `SharedModule` "for everything shared" in a new project. **Consequence:** every component pulls in unnecessary dependencies, and tree-shaking gets worse. **Correct:** import into a component exactly those standalone components, directives and pipes that its template uses.

## Interview checkpoint

**Q: What are NgModules and why did Angular move to standalone components?**

A: NgModules were containers that declared components and configured their compilation context and providers. They added indirection: to understand a component's dependencies you had to read its module. Standalone components declare their own dependencies, which simplifies the mental model, improves tree-shaking and makes lazy loading of a single component possible. NgModules are still supported for existing code and libraries.

## Done when

- [ ] You can name the 4 `@NgModule` keys and their modern counterparts.
- [ ] You have seen the `NG8001` error and know how to fix it.
- [ ] Day 1 is complete: mark your progress in [PROGRESS.md](../../PROGRESS.md).

---
Docs: [NgModules](https://angular.dev/guide/ngmodules/overview) · [Migrate to standalone](https://angular.dev/reference/migrations/standalone)

[← Previous: Template bindings](05-template-bindings.md) · [Next: Typed model, @for and @if →](../day-02-components-state/01-typed-model-and-control-flow.md)
