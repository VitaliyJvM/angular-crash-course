# Project structure — ParcelFlow Lite

Структура відповідає Angular CLI 22.2 (`ng new` без SSR). Набір файлів може змінюватися між major-версіями — актуальний опис: <https://angular.dev/reference/configs/file-structure>.

## Workspace

```
app/
├── angular.json            # build / serve / test targets, assets, styles, budgets
├── package.json            # залежності, npm scripts
├── tsconfig.json           # спільні TypeScript + angularCompilerOptions
├── tsconfig.app.json       # конфігурація застосунку
├── tsconfig.spec.json      # конфігурація тестів (types: vitest/globals)
├── .editorconfig · .prettierrc · .gitignore
├── public/                 # статичні файли, копіюються в build без змін
│   ├── favicon.ico
│   └── data/shipments.json # JSON fixture замість backend (лише GET)
└── src/
    ├── index.html          # єдина сторінка з <app-root>
    ├── main.ts             # bootstrapApplication(App, appConfig)
    ├── styles.css          # глобальні стилі
    └── app/                # код застосунку ↓
```

## `src/app`

```
src/app/
├── app.ts · app.html · app.css · app.spec.ts   # кореневий компонент: shell + nav + <router-outlet>
├── app.config.ts                               # глобальні providers
├── app.routes.ts                               # таблиця маршрутів
└── features/
    └── shipments/
        ├── shipment.model.ts                   # типи домену: Shipment, ShipmentStatus, TrackingEvent, NewShipment
        ├── shipment-api.ts                     # data access: HttpClient, URL, Observable
        ├── shipment-store.ts                   # стан feature: signals + load/add/markDelivered
        ├── shipment-store.spec.ts
        ├── shipment-list/                      # page (smart): фільтри, пошук, стани завантаження
        ├── shipment-card/                      # presentational: input() + output()
        ├── shipment-details/                   # page: route param → computed shipment
        ├── shipment-form/                      # page: Signal Forms
        └── shipment-form-reactive/             # компактний приклад Reactive Forms для порівняння
```

## Хто за що відповідає

| Шар | Файл | Знає про | Не знає про |
|-----|------|----------|-------------|
| Model | `shipment.model.ts` | форму даних | Angular узагалі |
| Data access | `ShipmentApi` | HTTP, URL, типи відповіді | UI, стан |
| State | `ShipmentStore` | поточні дані, loading/error, правила зміни | HTTP-деталі, DOM |
| Page component | `ShipmentList`, `ShipmentDetails`, `ShipmentForm` | store, router, UI-стан (фільтр, пошук) | як дані завантажуються |
| Presentational component | `ShipmentCard` | свої inputs/outputs | store, router-навігацію з коду, HTTP |

Напрям залежностей один: component → store → api → `HttpClient`. Це той самий принцип, що controller → service → repository у Spring.

## Naming conventions (CLI 20+)

| Що | Файл | Клас |
|----|------|------|
| Component | `shipment-list.ts` (+ `.html`, `.css`, `.spec.ts`) | `ShipmentList` |
| Service | `shipment-store.ts` | `ShipmentStore` |
| Model / types | `shipment.model.ts` | `Shipment` |
| Routes | `app.routes.ts` | `routes` |
| Selector | prefix `app-` із `angular.json` | `app-shipment-list` |

У legacy-проєктах: `shipment-list.component.ts` / `ShipmentListComponent`, `shipment.service.ts` / `ShipmentService`, `app.module.ts`.

## Як структура росте

```
src/app/
├── core/          # app-wide інфраструктура: auth, interceptors, error handling, layout shell
├── shared/        # перевикористовувані UI-компоненти, pipes, directives без бізнес-логіки
└── features/
    ├── shipments/ # власний shipments.routes.ts, lazy-loaded через loadChildren
    └── carriers/
```

Правила: feature не імпортує з іншої feature напряму (спільне виносять у `shared/` чи `core/`); кожна feature lazy-loaded; великі workspaces діляться на libraries (Nx / `ng generate library`) — **Optional / Outside 5-hour course**.
