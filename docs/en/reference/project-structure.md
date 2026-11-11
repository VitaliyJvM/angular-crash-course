# Project structure — ParcelFlow Lite

**English** | [Українська](../../uk/reference/project-structure.md)

The structure matches Angular CLI 22.2 (`ng new` without SSR). The set of files may change between major versions — the current description: <https://angular.dev/reference/configs/file-structure>.

## Workspace

```
app/
├── angular.json            # build / serve / test targets, assets, styles, budgets
├── package.json            # dependencies, npm scripts
├── tsconfig.json           # shared TypeScript + angularCompilerOptions
├── tsconfig.app.json       # application configuration
├── tsconfig.spec.json      # test configuration (types: vitest/globals)
├── .editorconfig · .prettierrc · .gitignore
├── public/                 # static files, copied into the build unchanged
│   ├── favicon.ico
│   └── data/shipments.json # JSON fixture instead of a backend (GET only)
└── src/
    ├── index.html          # the single page with <app-root>
    ├── main.ts             # bootstrapApplication(App, appConfig)
    ├── styles.css          # global styles
    └── app/                # application code ↓
```

## `src/app`

```
src/app/
├── app.ts · app.html · app.css · app.spec.ts   # root component: shell + nav + <router-outlet>
├── app.config.ts                               # global providers
├── app.routes.ts                               # route table
└── features/
    └── shipments/
        ├── shipment.model.ts                   # domain types: Shipment, ShipmentStatus, TrackingEvent, NewShipment
        ├── shipment-api.ts                     # data access: HttpClient, URL, Observable
        ├── shipment-store.ts                   # feature state: signals + load/add/markDelivered
        ├── shipment-store.spec.ts
        ├── shipment-list/                      # page (smart): filters, search, loading states
        ├── shipment-card/                      # presentational: input() + output()
        ├── shipment-details/                   # page: route param → computed shipment
        ├── shipment-form/                      # page: Signal Forms
        └── shipment-form-reactive/             # compact Reactive Forms example for comparison
```

## Who is responsible for what

| Layer | File | Knows about | Does not know about |
|-----|------|----------|-------------|
| Model | `shipment.model.ts` | the shape of the data | Angular at all |
| Data access | `ShipmentApi` | HTTP, URL, response types | UI, state |
| State | `ShipmentStore` | current data, loading/error, mutation rules | HTTP details, DOM |
| Page component | `ShipmentList`, `ShipmentDetails`, `ShipmentForm` | store, router, UI state (filter, search) | how the data is loaded |
| Presentational component | `ShipmentCard` | its own inputs/outputs | store, programmatic router navigation, HTTP |

Dependencies point in one direction: component → store → api → `HttpClient`. It is the same principle as controller → service → repository in Spring.

## Naming conventions (CLI 20+)

| What | File | Class |
|----|------|------|
| Component | `shipment-list.ts` (+ `.html`, `.css`, `.spec.ts`) | `ShipmentList` |
| Service | `shipment-store.ts` | `ShipmentStore` |
| Model / types | `shipment.model.ts` | `Shipment` |
| Routes | `app.routes.ts` | `routes` |
| Selector | prefix `app-` from `angular.json` | `app-shipment-list` |

In legacy projects: `shipment-list.component.ts` / `ShipmentListComponent`, `shipment.service.ts` / `ShipmentService`, `app.module.ts`.

## How the structure grows

```
src/app/
├── core/          # app-wide infrastructure: auth, interceptors, error handling, layout shell
├── shared/        # reusable UI components, pipes, directives without business logic
└── features/
    ├── shipments/ # its own shipments.routes.ts, lazy-loaded via loadChildren
    └── carriers/
```

Rules: a feature does not import from another feature directly (shared code is moved into `shared/` or `core/`); every feature is lazy-loaded; large workspaces are split into libraries (Nx / `ng generate library`) — **Optional / Outside 5-hour course**.
