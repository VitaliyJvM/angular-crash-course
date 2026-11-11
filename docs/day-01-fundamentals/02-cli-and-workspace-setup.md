# Day 1 · Lesson 2 — Angular CLI та створення workspace

**Estimated time:** 15 хв · **Time budget:** read 3 · setup & run 9 · try 2 · verify 1
**Learning outcome:** власний Angular 22 workspace `practice/` створено через CLI і запущено в браузері.

[← Попередній: Angular vs React: mental model](01-angular-vs-react-mental-model.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Тур по workspace →](03-workspace-tour.md)

## Why it matters

В Angular-проєктах CLI — єдина точка входу: створення проєкту, генерація коду, dev server, build, тести, оновлення версій (`ng update`). На співбесіді очікують, що ти знаєш основні команди.

## Concept

**Workspace** — тека з `angular.json`; усередині один або кілька **projects** (applications чи libraries). `ng new` створює workspace з одним application.

| Команда | Що робить | Аналог у React-світі |
|---------|-----------|----------------------|
| `ng new <name>` | створює workspace + application | `npm create vite@latest` |
| `ng serve` (`npm start`) | dev server з HMR на `:4200` | `vite dev` |
| `ng generate component <path>` | генерує файли компонента | немає стандартного |
| `ng build` | production build у `dist/` | `vite build` |
| `ng test` | unit tests (Vitest) | `vitest` |

Усередині workspace CLI встановлено локально (`node_modules/.bin/ng`), тому в курсі використовується `npx ng …` — глобальна установка не потрібна.

> Застереження: набір файлів і запитань `ng new` змінюється між major-версіями. Усе нижче перевірено на CLI **22.2.6**; якщо в тебе новіша версія, орієнтуйся на <https://angular.dev/tools/cli>.

## Follow along

1. Перевір Node.js — потрібна `^22.22.3`, `^24.15.0` або `>=26`:

   ```bash
   node -v
   ```

2. З **кореня цього репозиторію** створи workspace у теці `practice/`:

   ```bash
   npx @angular/cli@22 new parcelflow-lite --directory practice --style css --ssr false --skip-git --ai-config none
   ```

   - `--directory practice` — тека workspace (назва проєкту лишається `parcelflow-lite`);
   - `--style css`, `--ssr false`, `--ai-config none` — відповіді на запитання CLI наперед (SSR поза курсом);
   - `--skip-git` — ми вже всередині Git-репозиторію;
   - на запитання про анонімну аналітику відповідай на свій розсуд (`N` — нормально).

   Установка залежностей триває 1–2 хвилини. Поки чекаєш — прочитай блок Concept ще раз.

3. Запусти dev server:

   ```bash
   cd practice
   npm start
   ```

4. Відкрий <http://localhost:4200>. Має з'явитися стартова сторінка Angular з текстом **Hello, parcelflow-lite**.

5. Не зупиняючи сервер, відкрий `src/app/app.ts` і зміни значення signal:

   ```ts
   protected readonly title = signal('ParcelFlow Lite');
   ```

   Збережи файл — сторінка оновиться без перезавантаження.

6. У другому терміналі (з `practice/`) подивись, що ще вміє CLI:

   ```bash
   npx ng version
   npx ng generate --help
   ```

## Try it yourself

Зроби production build і знайди, куди CLI поклав результат. Скільки важить основний JS bundle (raw та estimated transfer size)?

Hint: потрібна одна команда з таблиці вище; розміри CLI друкує в терміналі.

## Verify / Expected result

- `npx ng version` показує Angular CLI **22.x** і Angular **22.x**.
- <http://localhost:4200> показує заголовок із новим title.
- Після build з'явилася тека `dist/parcelflow-lite/browser/` з `index.html` і файлом `main-<hash>.js` (порожній застосунок — приблизно 200 kB raw / 55 kB transfer).

## Common mistake / Best practice

**Помилка:** встановити глобально стару версію CLI (`npm i -g @angular/cli` колись давно) і створити проєкт нею. **Наслідок:** інша структура файлів (`app.component.ts`, NgModules, Karma) і код курсу не збігається. **Правильно:** явно вказувати major-версію (`npx @angular/cli@22 new …`), а всередині workspace завжди викликати локальний CLI через `npx ng` або npm scripts.

## Interview checkpoint

**Q: What is the Angular CLI used for?**
A: It scaffolds workspaces and code (`ng new`, `ng generate`), runs the dev server, builds for production, runs tests, and automates version upgrades with `ng update`. It also enforces a standard project structure, which keeps Angular codebases consistent across teams.

**Q: What is the difference between a workspace and a project?**
A: A workspace is the folder configured by `angular.json`; it can contain several projects — applications and libraries — that share dependencies and tooling.

## Done when

- [ ] Тека `practice/` існує, у ній є `angular.json` і `node_modules/`.
- [ ] `npm start` піднімає застосунок на `localhost:4200`, зміна `title` видима в браузері.
- [ ] `npx ng build` завершується без помилок.

---
Docs: [Installation](https://angular.dev/installation) · [CLI overview](https://angular.dev/tools/cli) · [Version compatibility](https://angular.dev/reference/versions)

[← Попередній: Angular vs React: mental model](01-angular-vs-react-mental-model.md) · [Наступний: Тур по workspace →](03-workspace-tour.md)
