# Day 1 · Lesson 4 — Перший компонент: `ShipmentList`

[English](../../../en/lessons/day-01-fundamentals/04-first-component.md) | **Українська**

**Estimated time:** 15 хв · **Time budget:** read 3 · code 8 · try 2 · verify 2

**Learning outcome:** згенеровано feature-компонент `ShipmentList`, підключено його до `App`, і ти розумієш, як Angular знаходить і рендерить компонент.

[← Попередній: Тур по workspace](03-workspace-tour.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Template bindings →](05-template-bindings.md)

## Why it matters

Увесь UI в Angular — дерево компонентів. Генерація через CLI, feature-based розташування та явні `imports` — щоденна рутина в будь-якому проєкті.

## Concept

Компонент = TypeScript-клас + metadata в декораторі `@Component`:

```ts
@Component({
  selector: 'app-shipment-list',        // HTML-тег, за яким компонент використовують
  imports: [],                          // компоненти/directives/pipes, які використовує template
  templateUrl: './shipment-list.html',  // або inline: template: `...`
  styleUrl: './shipment-list.css',      // стилі ізольовані в межах компонента
})
export class ShipmentList {}
```

Як це рендериться: Angular compiler перетворює template на JS-інструкції під час build. Коли в чиємусь template трапляється `<app-shipment-list />`, Angular створює **один екземпляр класу**, виконує його template і вставляє DOM у цей елемент.

| React | Angular |
|-------|---------|
| `import { ShipmentList } from …` + `<ShipmentList />` | TS `import` **і** запис у `imports: [...]` декоратора + `<app-shipment-list />` |
| JSX у тому самому файлі | окремий `.html` (або inline `template`) |
| CSS Modules / styled-components | вбудована ізоляція стилів компонента |
| функція викликається на кожен render | клас створюється один раз; поля класу — це стан |

> Застереження: `imports` у декораторі — не ES-import. Це список залежностей **template**, потрібний компілятору, щоб розпізнати теги.

Компоненти в курсі standalone (це default: окремо вказувати `standalone: true` не треба).

## Follow along

Усі команди — з теки `practice/`; dev server (`npm start`) хай працює.

1. Згенеруй компонент у feature-теці:

   ```bash
   npx ng generate component features/shipments/shipment-list --skip-tests
   ```

   CLI створить `src/app/features/shipments/shipment-list/` з файлами `shipment-list.ts`, `.html`, `.css`. `--skip-tests` — тести з'являться на Day 5.

2. Заміни **весь** вміст `src/app/app.html` (стартовий placeholder на ~340 рядків) на:

   ```html
   <header class="app-header">
     <h1>{{ title() }}</h1>
   </header>

   <main>
     <app-shipment-list />
   </main>
   ```

3. Онови `src/app/app.ts` — імпортуй компонент і додай його в `imports` (а `RouterOutlet` поки прибери, він повернеться на Day 4):

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

4. Щоб не витрачати час на дизайн, скопіюй готові стилі з еталонного проєкту:

   ```bash
   cp ../app/src/styles.css src/styles.css
   cp ../app/src/app/app.css src/app/app.css
   ```

5. Згенерований тест `App` перевіряє старий текст. У `src/app/app.spec.ts` заміни очікування в останньому тесті:

   ```ts
   expect(compiled.querySelector('h1')?.textContent).toContain('ParcelFlow Lite');
   ```

6. Подивись у браузер: заголовок **ParcelFlow Lite** і нижче текст `shipment-list works!`.

## Try it yourself

У template `ShipmentList` заміни стандартний абзац на заголовок другого рівня `Shipments`. Потім у DevTools знайди елемент `<app-shipment-list>` і подивись, які атрибути Angular додав до нього та до `<h2>`.

Hint: атрибути виду `_ngcontent-…` / `_nghost-…` — це механізм ізоляції стилів.

## Verify / Expected result

- У браузері: шапка з `ParcelFlow Lite`, під нею `Shipments`.
- У DevTools: `<app-root>` → `<main>` → `<app-shipment-list>` → `<h2>`.
- `npx ng test --no-watch` — 2 тести проходять.

## Common mistake / Best practice

**Помилка:** використати `<app-shipment-list />` у template, але забути додати `ShipmentList` у `imports` компонента. **Наслідок:** помилка компіляції `NG8001: 'app-shipment-list' is not a known element`. **Правильно:** кожен компонент явно перелічує залежності свого template в `imports`; IDE з Angular Language Service додає це автоматично.

**Best practice:** групуй код за feature (`features/shipments/…`), а не за типом файлів (`components/`, `services/`) — так межі відповідальності видно зі структури тек.

## Interview checkpoint

**Q: What is a component in Angular?**

A: A component is a TypeScript class decorated with `@Component` that defines a selector, a template and optional styles. The class holds state and behavior, the template describes the view, and Angular creates one instance per element matching the selector.

**Q: What does the `imports` array in `@Component` do?**

A: It lists the components, directives and pipes the template uses. Standalone components declare their own template dependencies there instead of relying on an NgModule.

## Done when

- [ ] `src/app/features/shipments/shipment-list/` містить три файли компонента.
- [ ] `app.html` складається лише з header і `<app-shipment-list />`.
- [ ] У браузері видно `ParcelFlow Lite` і `Shipments`; тести зелені.

---
Docs: [Anatomy of a component](https://angular.dev/guide/components) · [Component selectors](https://angular.dev/guide/components/selectors) · [Style guide](https://angular.dev/style-guide)

[← Попередній: Тур по workspace](03-workspace-tour.md) · [Наступний: Template bindings →](05-template-bindings.md)
