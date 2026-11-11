# Day 1 · Lesson 4 — First component: `ShipmentList`

**English** | [Українська](../../../uk/lessons/day-01-fundamentals/04-first-component.md)

**Estimated time:** 15 min · **Time budget:** read 3 · code 8 · try 2 · verify 2

**Learning outcome:** the feature component `ShipmentList` is generated and wired into `App`, and you understand how Angular finds and renders a component.

[← Previous: Workspace tour: from angular.json to App](03-workspace-tour.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Template bindings →](05-template-bindings.md)

## Why it matters

All UI in Angular is a tree of components. Generating code with the CLI, feature-based placement and explicit `imports` are daily routine in any project.

## Concept

A component = a TypeScript class + metadata in the `@Component` decorator:

```ts
@Component({
  selector: 'app-shipment-list',        // the HTML tag used to place the component
  imports: [],                          // components/directives/pipes the template uses
  templateUrl: './shipment-list.html',  // or inline: template: `...`
  styleUrl: './shipment-list.css',      // styles are scoped to the component
})
export class ShipmentList {}
```

How it is rendered: the Angular compiler turns the template into JS instructions at build time. When `<app-shipment-list />` appears in some template, Angular creates **one instance of the class**, executes its template and inserts the DOM into that element.

| React | Angular |
|-------|---------|
| `import { ShipmentList } from …` + `<ShipmentList />` | TS `import` **and** an entry in the decorator's `imports: [...]` + `<app-shipment-list />` |
| JSX in the same file | a separate `.html` (or an inline `template`) |
| CSS Modules / styled-components | built-in view encapsulation (emulated) |
| the function is called on every render | the class is created once; class fields are the state |

> Caveat: `imports` in the decorator is not an ES import. It is the list of **template** dependencies that the compiler needs in order to recognize the tags.

The components in this course are standalone (this is the default: you do not need to specify `standalone: true` separately).

## Follow along

Run all commands from the `practice/` folder; keep the dev server (`npm start`) running.

1. Generate the component in a feature folder:

   ```bash
   npx ng generate component features/shipments/shipment-list --skip-tests
   ```

   The CLI creates `src/app/features/shipments/shipment-list/` with the files `shipment-list.ts`, `.html`, `.css`. `--skip-tests` — tests will appear on Day 5.

2. Replace the **entire** content of `src/app/app.html` (the ~340-line starter placeholder) with:

   ```html
   <header class="app-header">
     <h1>{{ title() }}</h1>
   </header>

   <main>
     <app-shipment-list />
   </main>
   ```

3. Update `src/app/app.ts` — import the component and add it to `imports` (and remove `RouterOutlet` for now; it will come back on Day 4):

   ```ts
   import { Component, signal } from '@angular/core';
   import { ShipmentList } from './features/shipments/shipment-list/shipment-list';

   @Component({
     imports: [ShipmentList],
     selector: 'app-root',
     styleUrl: './app.css',
     templateUrl: './app.html',
   })
   export class App {
     protected readonly title = signal('ParcelFlow Lite');
   }
   ```

4. To avoid spending time on design, copy the ready-made styles from the reference project:

   ```bash
   cp ../app/src/styles.css src/styles.css
   cp ../app/src/app/app.css src/app/app.css
   ```

5. The generated `App` test checks the old text. In `src/app/app.spec.ts`, replace the expectation in the last test:

   ```ts
   expect(compiled.querySelector('h1')?.textContent).toContain('ParcelFlow Lite');
   ```

6. Look at the browser: the heading **ParcelFlow Lite** and, below it, the text `shipment-list works!`.

## Try it yourself

In the `ShipmentList` template, replace the default paragraph with a second-level heading `Shipments`. Then find the `<app-shipment-list>` element in DevTools and see which attributes Angular added to it and to the `<h2>`.

Hint: attributes of the form `_ngcontent-…` / `_nghost-…` are how Angular's emulated view encapsulation scopes the component's styles.

## Verify / Expected result

- In the browser: a header with `ParcelFlow Lite`, and `Shipments` below it.
- In DevTools: `<app-root>` → `<main>` → `<app-shipment-list>` → `<h2>`.
- `npx ng test --no-watch` — 2 tests pass.

## Common mistake / Best practice

**Mistake:** using `<app-shipment-list />` in a template but forgetting to add `ShipmentList` to the component's `imports`. **Consequence:** the compilation error `NG8001: 'app-shipment-list' is not a known element`. **Correct:** every component explicitly lists its template dependencies in `imports`; an IDE with the Angular Language Service adds this automatically.

**Best practice:** group code by feature (`features/shipments/…`), not by file type (`components/`, `services/`) — that way the boundaries of responsibility are visible from the folder structure.

## Interview checkpoint

**Q: What is a component in Angular?**

A: A component is a TypeScript class decorated with `@Component` that defines a selector, a template and optional styles. The class holds state and behavior, the template describes the view, and Angular creates one instance per element matching the selector.

**Q: What does the `imports` array in `@Component` do?**

A: It lists the components, directives and pipes the template uses. Standalone components declare their own template dependencies there instead of relying on an NgModule.

## Done when

- [ ] `src/app/features/shipments/shipment-list/` contains the three component files.
- [ ] `app.html` consists only of the header and `<app-shipment-list />`.
- [ ] `ParcelFlow Lite` and `Shipments` are visible in the browser; the tests are green.

---
Docs: [Anatomy of a component](https://angular.dev/guide/components) · [Component selectors](https://angular.dev/guide/components/selectors) · [Style guide](https://angular.dev/style-guide)

[← Previous: Workspace tour: from angular.json to App](03-workspace-tour.md) · [Next: Template bindings →](05-template-bindings.md)
