# Day 3 · Lesson 1 — Services and inject(): ShipmentStore

**English** | [Українська](../../../uk/lessons/day-03-services-http/01-services-and-inject.md)

**Estimated time:** 10 min · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** move the shipment state out of the component into a `ShipmentStore` service and get it in the component via `inject()`.

[← Previous: Lifecycle, change detection, OnPush and zoneless](../day-02-components-state/06-lifecycle-and-change-detection.md) · [Course plan](../../COURSE-PLAN.md) · [Next: DI: provider scopes and comparison with Spring →](02-di-scopes-vs-spring.md)

## Why it matters

In a real Angular project a component is responsible only for the UI. Data, HTTP and business rules live in services, which DI hands out to everyone who needs them: the list, the details page, the form. Without this you would have to "thread" the state through inputs.

## Concept

A service is a plain class that Angular instantiates itself and hands out through dependency injection.

```ts
@Service()                      // Angular 22: auto-provided, one instance per application
export class ShipmentStore {}

export class ShipmentList {
  private readonly store = inject(ShipmentStore); // instead of constructor(private store: ShipmentStore)
}
```

- `@Service()` is what CLI 22 generates. In existing codebases you will see `@Injectable({ providedIn: 'root' })` — it works the same way and has not gone anywhere. In an interview, name both.
- `inject()` is the modern way; constructor injection is the legacy style, but still valid.
- The "signal-based store" pattern: a private writable signal + a public read-only one (`asReadonly()`), with changes only through methods.

| | Spring | React | Angular |
|---|---|---|---|
| Declaration | `@Service` | custom hook / context provider | `@Service()` |
| Obtaining it | `@Autowired` / constructor | `useContext()` / calling the hook | `inject()` |

Caveat: a custom hook creates **new state on every call**, whereas an Angular service is a **singleton** by default, so it is closer to a Spring bean or to a context than to a hook.

## Follow along

1. Generate the service (from the `practice/` folder):

   ```bash
   npx ng generate service features/shipments/shipment-store --skip-tests
   ```

2. Replace the contents of `src/app/features/shipments/shipment-store.ts`:

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

3. In `shipment-list/shipment-list.ts` remove the `shipments` signal, the `markDelivered` method and the `MOCK_SHIPMENTS` and `Shipment` imports; add the store:

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

   `store` is `protected` because the template accesses it. `statusFilter` stays in the component: it is UI state, not domain data.

4. In `shipment-list/shipment-list.html` change the card's event handler:

   ```html
   <app-shipment-card [shipment]="shipment" (delivered)="store.markDelivered($event)" />
   ```

## Try it yourself

Try to change the data directly from the component, bypassing the method: add a temporary method to the `ShipmentList` class that calls `this.store.shipments.set([])`. What does the compiler say, and why is that a good thing? Remove the method once you have checked.

Hint: look at the type that `asReadonly()` returns.

## Verify / Expected result

- `npm start` → http://localhost:4200 looks and works as it did at the end of Day 2: the filter, the counters, "Mark delivered".
- `shipment-list.ts` no longer imports `MOCK_SHIPMENTS`.
- `npx ng build` completes without errors.

## Common mistake / Best practice

**Pitfall:** making the signal in the service public and writable (`readonly shipments = signal(...)`). Then any component can call `.set()`, and a month later nobody knows who changed the state.

**Do this instead:** a private writable signal + `asReadonly()` + named methods (`markDelivered`). It is the same encapsulation principle as a private field with public methods in a Spring service.

## Interview checkpoint

**Q: What is a service in Angular and why use one?**

A: A service is a class managed by Angular's dependency injection that holds logic or state not tied to a view — data access, business rules, shared state. Components stay thin and get services via `inject()`, which makes code reusable and easy to test with fakes.

**Q: `inject()` vs constructor injection?**

A: Both resolve the same dependencies. `inject()` is the modern style: it works in field initializers and in functions such as guards and interceptors, and gives better type inference. It only works inside an injection context — during construction, not in arbitrary callbacks.

## Done when

- [ ] `shipment-store.ts` exists and the class is marked with `@Service()`.
- [ ] `ShipmentList` does not hold the list of shipments; it reads `store.shipments()`.
- [ ] "Mark delivered" works through `store.markDelivered($event)`.
- [ ] You can explain how `@Service()` differs from `@Injectable({ providedIn: 'root' })` (in nothing essential: the new and the old notation for an app-wide singleton).

---
Docs: [Creating and using services](https://angular.dev/guide/di/creating-and-using-services) · [Dependency injection overview](https://angular.dev/guide/di)

[← Previous: Lifecycle, change detection, OnPush and zoneless](../day-02-components-state/06-lifecycle-and-change-detection.md) · [Next: DI: provider scopes and comparison with Spring →](02-di-scopes-vs-spring.md)
