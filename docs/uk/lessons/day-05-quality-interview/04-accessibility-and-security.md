# Day 5 · Lesson 4 — Accessibility та security basics

[English](../../../en/lessons/day-05-quality-interview/04-accessibility-and-security.md) | **Українська**

**Estimated time:** 5 хв · **Time budget:** read 2 · keyboard walk-through 2 · try 1

**Learning outcome:** пройти ParcelFlow Lite лише клавіатурою та назвати, що у frontend-безпеці бере на себе Angular, а що — backend.

[← Попередній: Production structure та common mistakes](03-production-structure-and-mistakes.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Angular vs React: decision guide →](05-angular-vs-react-decision-guide.md)

## Why it matters

Доступність — вимога в більшості enterprise-проєктів (WCAG, державні й фінансові замовники), а XSS та «секрети у bundle» — найчастіші frontend-помилки безпеки. Обидві теми — типові короткі питання на співбесіді.

## Concept

**Accessibility — що вже є у вашому коді:**

| Прийом | Де в ParcelFlow Lite |
| --- | --- |
| `<label for>` + `id` або `<label>`, що обгортає input | форма; пошук у списку |
| Справжні `<button>` / `<a routerLink>` замість `<div (click)>` | фільтри, картка, навігація |
| `aria-pressed` для toggle-кнопок | статус-фільтр |
| `role="status"` (loading) / `role="alert"` (error) | список, деталі |
| `aria-describedby` → контейнер помилок з `aria-live="polite"` | поля форми |
| `ariaCurrentWhenActive="page"` на `routerLinkActive` | header nav |

Нативні елементи безкоштовно дають focus, Enter/Space і ролі для screen reader — тому «clickable div» є помилкою, а не стилем.

**Security у контексті frontend:**

- Interpolation `{{ value }}` **екранує** HTML; `[innerHTML]` **санітизується** Angular (скрипти й небезпечні атрибути вирізаються). React-паралель: JSX-екранування та `dangerouslySetInnerHTML`.
- Ніколи не викликайте `bypassSecurityTrustHtml` (та інші `bypassSecurityTrust*`) для даних від користувача чи API.
- У frontend bundle немає секретів: усе, що потрапило в JS, читає будь-хто (API keys, client secrets).
- Авторизація виконується на backend. Route guards і приховані кнопки — це UX, а не захист.
- Токени додаються централізовано через interceptors: `provideHttpClient(withInterceptors([...]))`; `HttpClient` має вбудовану підтримку XSRF (cookie → header).
- Для сесій надавайте перевагу HttpOnly cookies або короткоживучим токенам, а не довгоживучим токенам у `localStorage`.

## Follow along

1. Запустіть `npx ng serve`, відкрийте `http://localhost:4200/shipments` і **відкладіть мишу**.
2. `Tab` по сторінці: навігація → фільтри → пошук → посилання й кнопки карток. Фокус має бути видимим і йти у порядку читання.
3. На кнопці фільтра натисніть `Enter` або `Space` — фільтр змінюється. На tracking number натисніть `Enter` — відкриваються деталі.
4. Перейдіть `Tab`-ом на `New shipment`, натисніть `Enter`. У формі натисніть `Enter` у порожньому полі — з'являються повідомлення про помилки; заповніть поля й відправте форму клавіатурою.
5. У DevTools → Elements перевірте на активній кнопці фільтра `aria-pressed="true"`, а на активному пункті меню — `aria-current="page"`.

## Try it yourself

У `shipment-details.html` тимчасово виведіть опис події через `[innerHTML]` і підставте (у JSON fixture або прямо в шаблоні) рядок `<img src=x onerror="alert(1)">`. Що відрендериться і що з'явиться в консолі? Після експерименту **поверніть інтерполяцію**.

Hint: шукайте в консолі попередження про sanitization.

## Verify / Expected result

- Усі дії (фільтр, пошук, перехід на деталі, створення посилки) виконуються без миші.
- `alert` з експерименту **не** спрацьовує; у консолі — `WARNING: sanitizing HTML stripped some content`.
- У `src/` немає жодного `bypassSecurityTrust`: `grep -rn "bypassSecurityTrust" src/` нічого не повертає.

## Common mistake / Best practice

**Пастка:** `<div class="btn" (click)="open()">`. Наслідок: елемент не отримує фокус, не реагує на Enter/Space і невидимий для screen reader як кнопка — користувач клавіатури не може виконати дію. **Правильно:** `<button type="button">` для дій, `<a routerLink>` для навігації; `tabindex`, `role` і `keydown`-обробники потрібні лише для справді кастомних віджетів (тоді краще Angular CDK / Angular Aria).

## Interview checkpoint

**Q: How does Angular protect against XSS?**

A: Angular treats all bound values as untrusted: interpolation is escaped and bindings like `innerHTML` are sanitized automatically. The risk appears when developers bypass it with `bypassSecurityTrust*` or manipulate the DOM directly, so those should be avoided for user-controlled data.

**Q: Are route guards a security mechanism?**

A: No, they are a UX mechanism. Any client-side check can be bypassed, so authorization must be enforced by the backend on every request.

## Done when

- [ ] Пройшли сценарій «список → фільтр → деталі → нова посилка» лише клавіатурою.
- [ ] Бачили, що Angular вирізав `onerror` із `[innerHTML]`, і повернули шаблон до інтерполяції.
- [ ] Можете назвати 3 a11y-прийоми зі свого коду та 3 правила frontend security.

---

Docs: [Accessibility](https://angular.dev/best-practices/a11y) · [Security](https://angular.dev/best-practices/security) · [HTTP interceptors](https://angular.dev/guide/http/interceptors)

[← Попередній: Production structure та common mistakes](03-production-structure-and-mistakes.md) · [Наступний: Angular vs React: decision guide →](05-angular-vs-react-decision-guide.md)
