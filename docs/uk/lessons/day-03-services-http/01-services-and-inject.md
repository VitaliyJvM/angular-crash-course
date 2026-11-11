# Day 3 · Lesson 1 — Services та inject(): ShipmentStore

[English](../../../en/lessons/day-03-services-http/01-services-and-inject.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** винести стан посилок із компонента в service `ShipmentStore` і отримати його в компоненті через `inject()`.

[← Попередній: Lifecycle, change detection, OnPush і zoneless](../day-02-components-state/06-lifecycle-and-change-detection.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: DI: provider scopes і порівняння зі Spring →](02-di-scopes-vs-spring.md)

## Why it matters

У реальному Angular-проєкті компонент відповідає лише за UI. Дані, HTTP і бізнес-правила живуть у services, які DI роздає всім, кому вони потрібні: списку, сторінці деталей, формі. Без цього стан довелося б «протягувати» через inputs.

## Concept

Service — звичайний клас, який Angular створює сам і віддає через dependency injection.

```ts
@Service()                      // Angular 22: auto-provided, один екземпляр на застосунок
export class ShipmentStore {}

export class ShipmentList {
  private readonly store = inject(ShipmentStore); // замість constructor(private store: ShipmentStore)
}
```

- `@Service()` — те, що генерує CLI 22. У наявних кодових базах ти побачиш `@Injectable({ providedIn: 'root' })` — він працює так само і нікуди не зник. На співбесіді називай обидва.
- `inject()` — сучасний спосіб; constructor injection — legacy-стиль, але валідний.
- Патерн «store на signals»: приватний writable signal + публічний read-only (`asReadonly()`), зміни лише через методи.

| | Spring | React | Angular |
|---|---|---|---|
| Оголошення | `@Service` | custom hook / context provider | `@Service()` |
| Отримання | `@Autowired` / constructor | `useContext()` / виклик hook | `inject()` |

Застереження: custom hook створює **новий стан на кожен виклик**, а Angular service за замовчуванням — **singleton**, тобто ближче до Spring bean або до context, ніж до hook.

## Follow along

1. Згенеруй service (з папки `practice/`):

   ```bash
   npx ng generate service features/shipments/shipment-store --skip-tests
   ```

2. Заміни вміст `src/app/features/shipments/shipment-store.ts`:

   ```ts
   import { Service, signal } from '@angular/core';
   import { MOCK_SHIPMENTS } from './shipment.mock';
   import { Shipment } from './shipment.model';

   /** Feature state: a single source of truth for shipments, exposed as read-only signals. */
   @Service()
   export class ShipmentStore {
     private readonly _shipments = signal<Shipment[]>(MOCK_SHIPMENTS);

     readonly shipments = this._shipments.asReadonly();

     markDelivered(id: number): void {
       this._shipments.update((shipments) =>
         shipments.map((s) => (s.id === id ? { ...s, status: 'DELIVERED' } : s)),
       );
     }
   }
   ```

3. У `shipment-list/shipment-list.ts` прибери signal `shipments`, метод `markDelivered` та імпорти `MOCK_SHIPMENTS` і `Shipment`; додай store:

   ```ts
   import { Component, computed, inject, signal } from '@angular/core';
   import { ShipmentCard } from '../shipment-card/shipment-card';
   import { ShipmentStore } from '../shipment-store';
   import { SHIPMENT_STATUSES, ShipmentStatus } from '../shipment.model';

   type StatusFilter = ShipmentStatus | 'ALL';

   @Component({
     imports: [ShipmentCard],
     selector: 'app-shipment-list',
     styleUrl: './shipment-list.css',
     templateUrl: './shipment-list.html',
   })
   export class ShipmentList {
     protected readonly store = inject(ShipmentStore);

     protected readonly filterOptions: StatusFilter[] = ['ALL', ...SHIPMENT_STATUSES];
     protected readonly statusFilter = signal<StatusFilter>('ALL');

     protected readonly filteredShipments = computed(() => {
       const filter = this.statusFilter();
       const shipments = this.store.shipments();
       return filter === 'ALL' ? shipments : shipments.filter((s) => s.status === filter);
     });

     protected readonly counters = computed(() => {
       const shipments = this.store.shipments();
       return {
         total: shipments.length,
         inTransit: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
         delivered: shipments.filter((s) => s.status === 'DELIVERED').length,
       };
     });
   }
   ```

   `store` — `protected`, бо до нього звертається template. `statusFilter` лишається в компоненті: це UI state, а не доменні дані.

4. У `shipment-list/shipment-list.html` зміни обробник події картки:

   ```html
   <app-shipment-card [shipment]="shipment" (delivered)="store.markDelivered($event)" />
   ```

## Try it yourself

Спробуй із компонента напряму змінити дані в обхід методу: додай у клас `ShipmentList` тимчасовий метод, який викликає `this.store.shipments.set([])`. Що каже компілятор і чому це добре? Після перевірки видали метод.

Hint: подивись на тип, який повертає `asReadonly()`.

## Verify / Expected result

- `npm start` → http://localhost:4200 виглядає та працює як наприкінці Day 2: фільтр, лічильники, «Mark delivered».
- У `shipment-list.ts` більше немає імпорту `MOCK_SHIPMENTS`.
- `npx ng build` проходить без помилок.

## Common mistake / Best practice

**Пастка:** зробити signal у service публічним і writable (`readonly shipments = signal(...)`). Тоді будь-який компонент може викликати `.set()`, і через місяць ніхто не знає, хто змінив стан.

**Правильно:** приватний writable signal + `asReadonly()` + іменовані методи (`markDelivered`). Це той самий принцип інкапсуляції, що й приватне поле з публічними методами у Spring service.

## Interview checkpoint

**Q: What is a service in Angular and why use one?**

A: A service is a class managed by Angular's dependency injection that holds logic or state not tied to a view — data access, business rules, shared state. Components stay thin and get services via `inject()`, which makes code reusable and easy to test with fakes.

**Q: `inject()` vs constructor injection?**

A: Both resolve the same dependencies. `inject()` is the modern style: it works in field initializers and in functions such as guards and interceptors, and gives better type inference. It only works inside an injection context — during construction, not in arbitrary callbacks.

## Done when

- [ ] `shipment-store.ts` існує, клас позначений `@Service()`.
- [ ] `ShipmentList` не зберігає список посилок, а читає `store.shipments()`.
- [ ] «Mark delivered» працює через `store.markDelivered($event)`.
- [ ] Можеш пояснити, чим `@Service()` відрізняється від `@Injectable({ providedIn: 'root' })` (нічим суттєвим: новий і старий запис app-wide singleton).

---
Docs: [Creating and using services](https://angular.dev/guide/di/creating-and-using-services) · [Dependency injection overview](https://angular.dev/guide/di)

[← Попередній: Lifecycle, change detection, OnPush і zoneless](../day-02-components-state/06-lifecycle-and-change-detection.md) · [Наступний: DI: provider scopes і порівняння зі Spring →](02-di-scopes-vs-spring.md)
