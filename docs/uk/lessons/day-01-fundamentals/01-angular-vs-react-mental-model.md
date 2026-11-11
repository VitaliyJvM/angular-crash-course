# Day 1 · Lesson 1 — Angular vs React: mental model

[English](../../../en/lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) | **Українська**

**Estimated time:** 5 хв · **Time budget:** read 3 · try 1 · verify 1

**Learning outcome:** можеш назвати п'ять архітектурних відмінностей Angular від React і зіставити їх із тим, що вже знаєш.

[План курсу](../../COURSE-PLAN.md) · [Наступний: Angular CLI та створення workspace →](02-cli-and-workspace-setup.md)

## Why it matters

Більшість помилок React-розробника в Angular — це спроба писати «React на Angular»: тягнути сторонні бібліотеки для того, що вже є у framework, або тримати логіку в компонентах замість сервісів. Правильна ментальна модель економить години.

## Concept

React — це **library** для UI; router, forms, HTTP, DI та структуру проєкту обирає команда. Angular — **framework**: усе це входить у поставку й має одну рекомендовану форму.

| Тема | React | Angular 22 |
|------|-------|------------|
| Одиниця UI | function component, що повертає JSX | клас із `@Component` + окремий HTML template |
| Що відбувається при зміні стану | повторно виконується функція компонента, далі reconciliation | template скомпільовано заздалегідь; оновлюються лише bindings, які залежать від зміненого signal |
| Стан | `useState`, `useReducer` | `signal()`, `computed()` |
| Спільна логіка | custom hooks, context | services + dependency injection |
| Router / forms / HTTP | сторонні бібліотеки | `@angular/router`, `@angular/forms`, `HttpClient` |
| Tooling | Vite / Next.js на вибір | Angular CLI (`ng new`, `ng generate`, `ng build`, `ng test`) |

Для Spring-розробника Angular знайомий сильніше, ніж здається: декоратори ≈ annotations, services + DI ≈ beans + injection, CLI і conventions ≈ Spring Boot starters.

> Застереження: аналогії неповні. Angular DI — ієрархічний і працює в runtime у браузері; signals — це не hooks (немає правил порядку викликів і dependency arrays).

Мінімальний компонент Angular 22:

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

1. Прочитай таблицю вище ще раз і для кожного рядка згадай бібліотеку, яку ти використовуєш для цього в React-проєкті (наприклад, React Router, React Hook Form, TanStack Query).
2. Відкрий [reference/angular-vs-react.md](../../reference/angular-vs-react.md) і просто переглянь заголовки — до цієї шпаргалки ти повертатимешся протягом курсу.

## Try it yourself

Не підглядаючи, сформулюй уголос англійською одне речення: *«The main architectural difference between Angular and React is …»*.

## Verify / Expected result

У твоєму реченні є ідея «framework з вбудованими рішеннями та conventions vs library з екосистемою на вибір». Якщо ти сказав лише «Angular використовує TypeScript» чи «Angular складніший» — це не архітектурна відмінність.

## Common mistake / Best practice

**Помилка:** вважати, що Angular-компонент «перерендерюється» як React-функція, і оптимізувати за звичкою (`useMemo`-мислення всюди). **Наслідок:** зайвий код і неправильні відповіді на співбесіді. **Правильно:** клас компонента створюється один раз; змінюються значення signals, а Angular оновлює тільки залежні місця template.

## Interview checkpoint

**Q: What is the main difference between Angular and React?**

A: React is a UI library — you compose your own stack for routing, forms, HTTP and state. Angular is a full framework with a built-in router, forms, HTTP client, dependency injection and CLI, so teams get one consistent architecture out of the box at the cost of less flexibility.

## Done when

- [ ] Можеш назвати 5 відмінностей із таблиці без підглядання.
- [ ] Проговорив англійською відповідь на interview question.

---
Docs: [What is Angular?](https://angular.dev/overview) · [Essentials](https://angular.dev/essentials)

[План курсу](../../COURSE-PLAN.md) · [Наступний: Angular CLI та створення workspace →](02-cli-and-workspace-setup.md)
