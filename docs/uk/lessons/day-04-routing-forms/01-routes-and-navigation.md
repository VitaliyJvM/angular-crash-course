# Day 4 · Lesson 1 — Routes та навігація

[English](../../../en/lessons/day-04-routing-forms/01-routes-and-navigation.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 2 · code 5 · try 2 · verify 1

**Learning outcome:** застосунок має route configuration, `<router-outlet />` і навігаційне меню з `routerLink`; список посилок відкривається за URL `/shipments`.

[← Попередній: Signals vs RxJS: що коли обирати](../day-03-services-http/06-signals-vs-rxjs.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Route parameters: сторінка ShipmentDetails →](02-route-params-details.md)

## Why it matters

У реальному Angular-проєкті майже кожен екран — це route: URL є частиною стану застосунку (deep links, кнопка Back, закладки). Angular Router входить у фреймворк, тому конфігурація маршрутів виглядає однаково в усіх командах.

## Concept

- **`Routes`** — масив об'єктів `{ path, component | loadComponent | redirectTo, title }`. Router шукає **перший** збіг зверху вниз, тому порядок важливий.
- **`provideRouter(routes)`** в `app.config.ts` реєструє Router (CLI вже додав це на Day 1).
- **`<router-outlet />`** — місце, куди Router рендерить компонент активного route.
- **`routerLink`** — декларативна навігація без перезавантаження сторінки; **`routerLinkActive`** додає CSS-клас активному посиланню.

```ts
export const routes: Routes = [
  { path: 'shipments', component: ShipmentList, title: 'Shipments' },
];
```

| React Router | Angular Router |
| --- | --- |
| `<Route path="shipments" element={<ShipmentList />} />` | `{ path: 'shipments', component: ShipmentList }` |
| `<Outlet />` | `<router-outlet />` |
| `<Link to="/shipments">` / `<NavLink>` | `routerLink="/shipments"` / `routerLinkActive` |
| `<Navigate to=... />` | `redirectTo` |

Застереження: React Router — окрема бібліотека з кількома режимами (declarative / data / framework); Angular Router один, вбудований і інтегрований з DI (guards, resolvers, lazy loading).

## Follow along

1. Заміни `src/app/app.routes.ts`:

   ```ts
   import { Routes } from '@angular/router';
   import { ShipmentList } from './features/shipments/shipment-list/shipment-list';

   export const routes: Routes = [
     { path: '', pathMatch: 'full', redirectTo: 'shipments' },
     { path: 'shipments', component: ShipmentList, title: 'Shipments · ParcelFlow Lite' },
     { path: '**', redirectTo: 'shipments' },
   ];
   ```

   `pathMatch: 'full'` — redirect спрацьовує лише для порожнього URL; `'**'` (wildcard) ловить усе невідоме й завжди стоїть останнім.

2. Заміни `src/app/app.ts` — `App` більше не імпортує `ShipmentList` напряму, його рендерить Router:

   ```ts
   import { Component, signal } from '@angular/core';
   import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

   @Component({
     imports: [RouterOutlet, RouterLink, RouterLinkActive],
     selector: 'app-root',
     styleUrl: './app.css',
     templateUrl: './app.html',
   })
   export class App {
     protected readonly title = signal('ParcelFlow Lite');
   }
   ```

3. Заміни `src/app/app.html`:

   ```html
   <header class="app-header">
     <h1>{{ title() }}</h1>

     <nav aria-label="Main">
       <a
         routerLink="/shipments"
         routerLinkActive="active"
         ariaCurrentWhenActive="page"
         [routerLinkActiveOptions]="{ exact: true }"
       >
         Shipments
       </a>
     </nav>
   </header>

   <main>
     <router-outlet />
   </main>
   ```

   `ariaCurrentWhenActive="page"` виставляє `aria-current` для screen readers; `exact: true` — посилання активне лише на `/shipments`, а не на `/shipments/3`.

4. Додай у кінець `src/app/app.css` (copy-paste):

   ```css
   nav {
     display: flex;
     gap: 12px;
   }

   nav .active {
     font-weight: 600;
     text-decoration: none;
   }
   ```

5. Виправ `src/app/app.spec.ts`: `App` тепер містить `RouterLink`, якому потрібен Router у тестовому середовищі. Без цього `ng test` падає з `NG0201: No provider found for ActivatedRoute`.

   ```ts
   import { provideRouter } from '@angular/router';
   // ...
   await TestBed.configureTestingModule({
     imports: [App],
     providers: [provideRouter([])],
   }).compileComponents();
   ```

6. Запусти `npm start` і відкрий `http://localhost:4200/`.

## Try it yourself

Додай сторінку `/about`: маленький компонент `About` з одним абзацом тексту, route для нього та друге посилання в `nav`.

- Hint 1: `npx ng generate component features/about --inline-template --inline-style --skip-tests`.
- Hint 2: куди в масиві `routes` поставити новий запис відносно `'**'`?

Сторінка не потрібна наступним урокам — після перевірки можеш її видалити.

## Verify / Expected result

- `http://localhost:4200/` автоматично стає `/shipments`, список працює як раніше (фільтр, пошук, Mark delivered).
- `http://localhost:4200/whatever` теж перенаправляє на `/shipments`.
- Заголовок вкладки браузера — `Shipments · ParcelFlow Lite`.
- Посилання `Shipments` у header виділене жирним (клас `active`).
- `npx ng test --no-watch` — 2 тести проходять.

## Common mistake / Best practice

**Пастка:** використати `<a href="/shipments">` замість `routerLink`. Наслідок: браузер робить повне перезавантаження сторінки, увесь in-memory стан (сервіси, signals) скидається. **Правильно:** для внутрішніх переходів завжди `routerLink` (у template) або `Router.navigate()` (у коді); `href` — лише для зовнішніх посилань.

## Interview checkpoint

**Q: How does routing work in a standalone Angular application?**

A: Routes are a plain array of `Route` objects registered with `provideRouter(routes)` in the application config. The router matches the URL against that array, first match wins, and renders the matched component into `<router-outlet>`. Navigation is done with the `routerLink` directive or `Router.navigate()`.

**Q: Why does the order of routes matter?**

A: The router uses a first-match-wins strategy, so specific paths must come before parameterized ones and the `**` wildcard must be last, otherwise it would swallow every URL.

## Done when

- [ ] `/` і невідомі URL перенаправляють на `/shipments`.
- [ ] `App` не імпортує `ShipmentList`; список рендериться через `<router-outlet />`.
- [ ] Посилання в `nav` отримує клас `active` та `aria-current="page"`.
- [ ] `npx ng test --no-watch` проходить після правки `app.spec.ts`.

---
Docs: [Routing overview](https://angular.dev/guide/routing) · [Define routes](https://angular.dev/guide/routing/define-routes) · [Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes)

[← Попередній: Signals vs RxJS: що коли обирати](../day-03-services-http/06-signals-vs-rxjs.md) · [Наступний: Route parameters: сторінка ShipmentDetails →](02-route-params-details.md)
