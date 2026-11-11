# Day 4 · Lesson 1 — Routes and navigation

**English** | [Українська](../../../uk/lessons/day-04-routing-forms/01-routes-and-navigation.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 5 · try 2 · verify 1

**Learning outcome:** the application has a route configuration, `<router-outlet />` and a navigation menu with `routerLink`; the shipment list opens at the URL `/shipments`.

[← Previous: Signals vs RxJS: when to use which](../day-03-services-http/06-signals-vs-rxjs.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Route parameters: the ShipmentDetails page →](02-route-params-details.md)

## Why it matters

In a real Angular project almost every screen is a route: the URL is part of the application state (deep links, the Back button, bookmarks). Angular Router ships with the framework, so route configuration looks the same across all teams.

## Concept

- **`Routes`** — an array of `{ path, component | loadComponent | redirectTo, title }` objects. The Router looks for the **first** match from top to bottom, so order matters.
- **`provideRouter(routes)`** in `app.config.ts` registers the Router (the CLI already added this on Day 1).
- **`<router-outlet />`** — the place where the Router renders the component of the active route.
- **`routerLink`** — declarative navigation without a page reload; **`routerLinkActive`** adds a CSS class to the active link.

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

Caveat: React Router is a separate library with several modes (declarative / data / framework); Angular Router is a single, built-in router integrated with DI (guards, resolvers, lazy loading).

## Follow along

1. Replace `src/app/app.routes.ts`:

   ```ts
   import { Routes } from '@angular/router';
   import { ShipmentList } from './features/shipments/shipment-list/shipment-list';

   export const routes: Routes = [
     { path: '', pathMatch: 'full', redirectTo: 'shipments' },
     { path: 'shipments', component: ShipmentList, title: 'Shipments · ParcelFlow Lite' },
     { path: '**', redirectTo: 'shipments' },
   ];
   ```

   `pathMatch: 'full'` — the redirect fires only for the empty URL; `'**'` (wildcard) catches everything unknown and always comes last.

2. Replace `src/app/app.ts` — `App` no longer imports `ShipmentList` directly; the Router renders it:

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

3. Replace `src/app/app.html`:

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

   `ariaCurrentWhenActive="page"` sets `aria-current` for screen readers; `exact: true` — the link is active only on `/shipments`, not on `/shipments/3`.

4. Append to the end of `src/app/app.css` (copy-paste):

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

5. Fix `src/app/app.spec.ts`: `App` now contains `RouterLink`, which needs the Router in the test environment. Without it, `ng test` fails with `NG0201: No provider found for ActivatedRoute`.

   ```ts
   import { provideRouter } from '@angular/router';
   // ...
   await TestBed.configureTestingModule({
     imports: [App],
     providers: [provideRouter([])],
   }).compileComponents();
   ```

6. Run `npm start` and open `http://localhost:4200/`.

## Try it yourself

Add an `/about` page: a small `About` component with a single paragraph of text, a route for it and a second link in `nav`.

- Hint 1: `npx ng generate component features/about --inline-template --inline-style --skip-tests`.
- Hint 2: where in the `routes` array should the new entry go relative to `'**'`?

The following lessons do not need this page — you can delete it after checking that it works.

## Verify / Expected result

- `http://localhost:4200/` automatically becomes `/shipments`, and the list works as before (filter, search, Mark delivered).
- `http://localhost:4200/whatever` also redirects to `/shipments`.
- The browser tab title is `Shipments · ParcelFlow Lite`.
- The `Shipments` link in the header is shown in bold (the `active` class).
- `npx ng test --no-watch` — 2 tests pass.

## Common mistake / Best practice

**Pitfall:** using `<a href="/shipments">` instead of `routerLink`. Consequence: the browser does a full page reload and all in-memory state (services, signals) is reset. **Correct:** for internal navigation always use `routerLink` (in the template) or `Router.navigate()` (in code); `href` is only for external links.

## Interview checkpoint

**Q: How does routing work in a standalone Angular application?**

A: Routes are a plain array of `Route` objects registered with `provideRouter(routes)` in the application config. The router matches the URL against that array, first match wins, and renders the matched component into `<router-outlet>`. Navigation is done with the `routerLink` directive or `Router.navigate()`.

**Q: Why does the order of routes matter?**

A: The router uses a first-match-wins strategy, so specific paths must come before parameterized ones and the `**` wildcard must be last, otherwise it would swallow every URL.

## Done when

- [ ] `/` and unknown URLs redirect to `/shipments`.
- [ ] `App` does not import `ShipmentList`; the list is rendered through `<router-outlet />`.
- [ ] The link in `nav` gets the `active` class and `aria-current="page"`.
- [ ] `npx ng test --no-watch` passes after the `app.spec.ts` fix.

---
Docs: [Routing overview](https://angular.dev/guide/routing) · [Define routes](https://angular.dev/guide/routing/define-routes) · [Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes)

[← Previous: Signals vs RxJS: when to use which](../day-03-services-http/06-signals-vs-rxjs.md) · [Next: Route parameters: the ShipmentDetails page →](02-route-params-details.md)
