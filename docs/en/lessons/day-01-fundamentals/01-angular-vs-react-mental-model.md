# Day 1 · Lesson 1 — Angular vs React: mental model

**English** | [Українська](../../../uk/lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md)

**Estimated time:** 5 min · **Time budget:** read 3 · try 1 · verify 1

**Learning outcome:** you can name five architectural differences between Angular and React and map them to what you already know.

[Course plan](../../COURSE-PLAN.md) · [Next: Angular CLI and workspace setup →](02-cli-and-workspace-setup.md)

## Why it matters

Most mistakes a React developer makes in Angular come from trying to write "React in Angular": pulling in third-party libraries for things the framework already provides, or keeping logic in components instead of services. The right mental model saves hours.

## Concept

React is a **library** for UI; the team chooses the router, forms, HTTP, DI and project structure. Angular is a **framework**: all of that ships in the box and has one recommended shape.

| Topic | React | Angular 22 |
|------|-------|------------|
| Unit of UI | function component that returns JSX | class with `@Component` + a separate HTML template |
| What happens when state changes | the component function runs again, followed by reconciliation | the template is compiled ahead of time; only the bindings that depend on the changed signal are updated |
| State | `useState`, `useReducer` | `signal()`, `computed()` |
| Shared logic | custom hooks, context | services + dependency injection |
| Router / forms / HTTP | third-party libraries | `@angular/router`, `@angular/forms`, `HttpClient` |
| Tooling | Vite / Next.js, your choice | Angular CLI (`ng new`, `ng generate`, `ng build`, `ng test`) |

For a Spring developer, Angular is more familiar than it seems: decorators ≈ annotations, services + DI ≈ beans + injection, CLI and conventions ≈ Spring Boot starters.

> Caveat: the analogies are incomplete. Angular DI is hierarchical and works at runtime in the browser; signals are not hooks (there are no rules about call order and no dependency arrays).

A minimal Angular 22 component:

```ts
@Component({
  selector: 'app-hello',
  template: `<h1>Hello, {{ name() }}</h1>`,
})
export class Hello {
  protected readonly name = signal('Angular');
}
```

## Follow along

1. Read the table above once more and, for each row, recall the library you use for it in a React project (for example, React Router, React Hook Form, TanStack Query).
2. Open [reference/angular-vs-react.md](../../reference/angular-vs-react.md) and just skim the headings — you will come back to this cheat sheet throughout the course.

## Try it yourself

Without peeking, say one sentence aloud: *«The main architectural difference between Angular and React is …»*.

## Verify / Expected result

Your sentence contains the idea of "a framework with built-in solutions and conventions vs a library with an ecosystem to choose from". If you only said "Angular uses TypeScript" or "Angular is more complex", that is not an architectural difference.

## Common mistake / Best practice

**Mistake:** assuming an Angular component "re-renders" like a React function, and optimizing out of habit (`useMemo` thinking everywhere). **Consequence:** unnecessary code and wrong answers in an interview. **Correct:** the component class is created once; the signal values change, and Angular updates only the dependent places in the template.

## Interview checkpoint

**Q: What is the main difference between Angular and React?**

A: React is a UI library — you compose your own stack for routing, forms, HTTP and state. Angular is a full framework with a built-in router, forms, HTTP client, dependency injection and CLI, so teams get one consistent architecture out of the box at the cost of less flexibility.

## Done when

- [ ] You can name 5 differences from the table without peeking.
- [ ] You have said the answer to the interview question aloud.

---
Docs: [What is Angular?](https://angular.dev/overview) · [Essentials](https://angular.dev/essentials)

[Course plan](../../COURSE-PLAN.md) · [Next: Angular CLI and workspace setup →](02-cli-and-workspace-setup.md)
