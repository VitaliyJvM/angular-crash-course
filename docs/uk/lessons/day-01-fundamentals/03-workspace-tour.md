# Day 1 · Lesson 3 — Тур по workspace: від `angular.json` до `App`

[English](../../../en/lessons/day-01-fundamentals/03-workspace-tour.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 4 · follow 3 · try 2 · verify 1

**Learning outcome:** можеш простежити шлях запуску `index.html → main.ts → app.config.ts → App` і пояснити призначення кожного ключового файла.

[← Попередній: Angular CLI та створення workspace](02-cli-and-workspace-setup.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Перший компонент →](04-first-component.md)

## Why it matters

У чужому Angular-проєкті перші запитання завжди однакові: де точка входу, де глобальні providers, де маршрути. Структура стандартна, тож вивчивши її раз, ти орієнтуєшся в будь-якій codebase.

## Concept

Файли, які згенерував CLI 22 (скорочено):

| Файл | Призначення | Spring / React паралель |
|------|-------------|-------------------------|
| `angular.json` | конфігурація workspace: build/serve/test targets, assets, styles, budgets | `pom.xml` plugins / `vite.config.ts` |
| `package.json` | залежності та npm scripts (`start` → `ng serve`) | те саме |
| `tsconfig*.json` | TypeScript + `angularCompilerOptions` (strict templates) | `tsconfig.json` |
| `public/` | статичні файли, копіюються в build як є | `public/` у Vite |
| `src/index.html` | єдина HTML-сторінка з `<app-root>` | `index.html` з `<div id="root">` |
| `src/main.ts` | точка входу: `bootstrapApplication(App, appConfig)` | `main()` зі `SpringApplication.run` / `createRoot().render()` |
| `src/app/app.config.ts` | глобальні providers застосунку (router тощо) | `@Configuration` клас |
| `src/app/app.routes.ts` | таблиця маршрутів | route config React Router |
| `src/app/app.ts` / `.html` / `.css` / `.spec.ts` | кореневий компонент `App`: клас, template, стилі, тест | `App.tsx` |
| `src/styles.css` | глобальні стилі | `index.css` |

Ланцюжок запуску:

```
index.html  →  <app-root></app-root>
main.ts     →  bootstrapApplication(App, appConfig)
app.config  →  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)]
App         →  selector: 'app-root' → Angular рендерить template замість <app-root>
```

Зверни увагу на назви: з Angular 20 CLI генерує `app.ts` і клас `App`, а не `app.component.ts` / `AppComponent`. У legacy-проєктах ти побачиш старі суфікси — це лише naming convention.

> Застереження до аналогії зі Spring: `app.config.ts` не сканує classpath. Providers або перелічені явно, або сервіс сам оголошує себе доступним (детально — Day 3).

## Follow along

1. Відкрий `practice/src/index.html` і знайди `<app-root></app-root>`. Потім відкрий `src/app/app.ts` і знайди `selector: 'app-root'` — це зв'язок HTML і компонента.
2. Відкрий `src/main.ts`. Це весь bootstrap: кореневий компонент + конфігурація.
3. Відкрий `src/app/app.config.ts`. Зараз там два providers: глобальні error listeners і router із порожнім масивом `routes` (`app.routes.ts`).
4. Відкрий `package.json`. Зверни увагу: серед dependencies **немає `zone.js`** — застосунки Angular 21+ за замовчуванням zoneless (про це — урок 2.6). Test runner — `vitest` + `jsdom`.
5. Відкрий `angular.json`, знайди `architect.build.options`: `browser: "src/main.ts"`, `assets` із теки `public`, `styles`. Нижче — `test` з builder `@angular/build:unit-test`.
6. У браузері відкрий DevTools → Elements і розгорни `<app-root>`: усередині вже відрендерений template компонента.

## Try it yourself

Зміни `<title>` сторінки на `ParcelFlow Lite` і мову документа залиш `en`. У якому файлі це робиться і чи потрібен для цього TypeScript?

## Verify / Expected result

Вкладка браузера показує **ParcelFlow Lite**. Зміна зроблена в `src/index.html`; жодного TypeScript-коду не знадобилося.

## Common mistake / Best practice

**Помилка:** шукати `app.module.ts` або додавати його «за туторіалом». **Наслідок:** змішання двох архітектур і зайва складність. **Правильно:** у сучасному застосунку глобальна конфігурація живе в `app.config.ts` через `provide*()` функції; NgModules потрібні лише для підтримки legacy (урок 1.6).

## Interview checkpoint

**Q: How does an Angular application start?**

A: The browser loads `index.html`, which contains the root selector, typically `<app-root>`. The bundle runs `main.ts`, which calls `bootstrapApplication` with the root component and an application config holding global providers such as the router. Angular then instantiates the root component and renders its template into that element.

**Q: What is `angular.json` for?**

A: It is the workspace configuration: it defines projects and their build, serve and test targets — entry point, assets, global styles, budgets and per-environment configurations.

## Done when

- [ ] Можеш без підказки назвати 4 кроки ланцюжка запуску.
- [ ] Знаєш, де додаються глобальні providers і де оголошуються маршрути.
- [ ] `<title>` змінено на `ParcelFlow Lite`.

---
Docs: [Workspace and project file structure](https://angular.dev/reference/configs/file-structure) · [Workspace configuration](https://angular.dev/reference/configs/workspace-config)

[← Попередній: Angular CLI та створення workspace](02-cli-and-workspace-setup.md) · [Наступний: Перший компонент →](04-first-component.md)
