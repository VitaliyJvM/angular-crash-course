# Day 4 · Lesson 3 — Signal Forms: форма створення посилки

**Estimated time:** 15 хв · **Time budget:** read 3 · code 9 · try 2 · verify 1
**Learning outcome:** на `/shipments/new` працює форма на Signal Forms, яка додає посилку в `ShipmentStore` (in-memory) і повертає на список; route форми завантажується lazy.

[← Попередній: Route parameters: сторінка ShipmentDetails](02-route-params-details.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Validation, повідомлення про помилки та submit →](04-validation-and-submit.md)

## Why it matters

Форми — основна частина enterprise frontend: створення/редагування сутностей, фільтри, налаштування. В Angular форми — частина фреймворку, і від вибору підходу залежить, де живе стан форми та як пишеться валідація.

## Concept

**Signal Forms** (`@angular/forms/signals`, stable з Angular 22) будуються навколо однієї ідеї: **твій writable signal з моделлю — єдине джерело істини**, а форма — типізований «погляд» на нього.

```ts
model = signal({ trackingNumber: '', carrier: '' });
shipmentForm = form(this.model, (path) => {
  required(path.trackingNumber);
});
// shipmentForm.trackingNumber           -> field (прив'язуємо до input)
// shipmentForm.trackingNumber().value() -> значення; .invalid(), .touched(), .errors() -> стан
```

- `form(model, schema, options)` — створює **field tree**, структура якого виводиться з типу моделі (опечатка в імені поля — compile error).
- `[formField]` (directive `FormField`) — двостороння прив'язка input ↔ поле.
- `[formRoot]` (directive `FormRoot`) на `<form>` — ставить `novalidate`, робить `preventDefault()` і викликає `submission.action` **лише якщо форма валідна**.

**Чому це основний шлях курсу:** застосунок уже повністю signal-based на Angular 22, тож форма використовує ту саму ментальну модель, що й решта коду (signals + `computed`), з виведенням типів і без підписок. Офіційна рекомендація: Signal Forms — для нових signal-based застосунків (v22+). Водночас більшість наявних enterprise-codebases написані на Reactive Forms — їх розберемо компактно в Lesson 5.

React-паралель: controlled inputs + React Hook Form + Zod schema ≈ model signal + `form()` + schema-функція. Застереження: в Angular це вбудований API фреймворку, а не набір бібліотек; schema тут — функція з правилами, а не окремий validation-об'єкт (хоча `validateStandardSchema` дозволяє підключити Zod).

**Чесно про дані:** backend немає. Статичний JSON з `public/` віддається через GET, але прийняти POST не може, тому `store.add()` змінює лише signal у пам'яті — після reload нова посилка зникне.

## Follow along

1. Додай у `src/app/features/shipments/shipment.model.ts` (після `ShipmentStatus` і в кінець файлу відповідно):

   ```ts
   export const CARRIERS = ['Nova Poshta', 'Ukrposhta', 'DHL'] as const;
   ```

   ```ts
   /** What the "new shipment" form collects; id, status and createdAt are assigned by the store. */
   export type NewShipment = Pick<Shipment, 'trackingNumber' | 'carrier'>;
   ```

2. У `shipment-store.ts` онови import і додай метод у кінець класу:

   ```ts
   import { NewShipment, Shipment } from './shipment.model';
   ```

   ```ts
   /** In-memory only: there is no backend, so the new shipment disappears on page reload. */
   add(draft: NewShipment): Shipment {
     const shipment: Shipment = {
       ...draft,
       id: Math.max(0, ...this._shipments().map((s) => s.id)) + 1,
       status: 'CREATED',
       createdAt: new Date().toISOString(),
       events: [],
     };
     this._shipments.update((shipments) => [...shipments, shipment]);
     return shipment;
   }
   ```

3. Згенеруй компонент:

   ```bash
   npx ng generate component features/shipments/shipment-form --skip-tests
   ```

4. Заміни `shipment-form/shipment-form.ts`:

   ```ts
   import { Component, inject, signal } from '@angular/core';
   import { form, FormField, FormRoot, required } from '@angular/forms/signals';
   import { Router, RouterLink } from '@angular/router';
   import { ShipmentStore } from '../shipment-store';
   import { CARRIERS, NewShipment } from '../shipment.model';

   @Component({
     imports: [FormField, FormRoot, RouterLink],
     selector: 'app-shipment-form',
     styleUrl: './shipment-form.css',
     templateUrl: './shipment-form.html',
   })
   export class ShipmentForm {
     private readonly store = inject(ShipmentStore);
     private readonly router = inject(Router);

     protected readonly carriers = CARRIERS;

     // The model signal is the single source of truth; the form is a typed view over it.
     protected readonly model = signal<NewShipment>({ trackingNumber: '', carrier: '' });

     protected readonly shipmentForm = form(
       this.model,
       (path) => {
         required(path.trackingNumber, { message: 'Tracking number is required.' });
         required(path.carrier, { message: 'Choose a carrier.' });
       },
       {
         submission: {
           // Runs only when the form is valid.
           action: async () => {
             this.store.add(this.model());
             await this.router.navigate(['/shipments']);
           },
         },
       },
     );
   }
   ```

   `action` — async: у реальному застосунку тут був би `await` HTTP POST, а повернуті з нього помилки сервера стали б помилками полів. `router.navigate([...])` — програмна навігація (React: `useNavigate()`).

5. Заміни `shipment-form/shipment-form.html`:

   ```html
   <h2>New shipment</h2>

   <form class="form" [formRoot]="shipmentForm">
     <div class="field">
       <label for="trackingNumber">Tracking number</label>
       <input
         id="trackingNumber"
         type="text"
         placeholder="PF-1234"
         [formField]="shipmentForm.trackingNumber"
       />
     </div>

     <div class="field">
       <label for="carrier">Carrier</label>
       <select id="carrier" [formField]="shipmentForm.carrier">
         <option value="">Select a carrier</option>
         @for (carrier of carriers; track carrier) {
           <option [value]="carrier">{{ carrier }}</option>
         }
       </select>
     </div>

     <div class="actions">
       <button type="submit">Add shipment</button>
       <a routerLink="/shipments">Cancel</a>
     </div>
   </form>

   <p class="muted">
     There is no backend: the shipment is added in memory and disappears after a page reload.
   </p>
   ```

   Кожен control має `<label for>` ↔ `id` — це базова accessibility: клік по label фокусує поле, screen reader озвучує назву.

6. Заміни `shipment-form/shipment-form.css` (copy-paste):

   ```css
   .form {
     display: grid;
     gap: 12px;
     max-width: 360px;
   }

   .field {
     display: grid;
     gap: 4px;
   }

   .field .error {
     margin: 0;
     font-size: 0.9rem;
   }

   .actions {
     display: flex;
     align-items: center;
     gap: 12px;
   }
   ```

7. Додай **lazy** route у `app.routes.ts` — обов'язково **перед** `shipments/:id`:

   ```ts
   {
     // Must be declared before 'shipments/:id', otherwise "new" would be matched as an id.
     path: 'shipments/new',
     loadComponent: () =>
       import('./features/shipments/shipment-form/shipment-form').then((m) => m.ShipmentForm),
     title: 'New shipment · ParcelFlow Lite',
   },
   ```

   `loadComponent` + dynamic `import()` — код форми потрапляє в окремий chunk і завантажується лише при першому переході (React: `React.lazy()`).

8. Додай друге посилання в `nav` у `app.html` (після `Shipments`):

   ```html
   <a routerLink="/shipments/new" routerLinkActive="active" ariaCurrentWhenActive="page">
     New shipment
   </a>
   ```

## Try it yourself

Доведи собі, що модель — джерело істини: покажи під формою live preview моделі у вигляді JSON і додай кнопку **Reset**, яка очищає обидва поля.

- Hint 1: `JsonPipe` з `@angular/common`.
- Hint 2: `model` — звичайний `WritableSignal`; кнопці потрібен `type="button"`, інакше вона відправить форму.

## Verify / Expected result

- `New shipment` у header відкриває форму; заголовок вкладки — `New shipment · ParcelFlow Lite`.
- Заповни `PF-2000` + будь-який carrier → `Add shipment` → ти на `/shipments`, у списку нова посилка зі статусом `CREATED`, лічильник Total зріс.
- Reload сторінки — нова посилка зникла (очікувано: in-memory).
- Submit порожньої форми нічого не робить (`action` не викликається); повідомлення про помилки додамо в наступному уроці.
- `npx ng build` показує окремий lazy chunk `shipment-form`.

## Common mistake / Best practice

**Пастка:** поставити `shipments/:id` вище за `shipments/new`. Наслідок: Router матчить `new` як `id`, відкривається `ShipmentDetails` з повідомленням `Shipment #new not found`. **Правильно:** статичні сегменти оголошувати перед параметризованими (first match wins).

## Interview checkpoint

**Q: What are Signal Forms and how do they differ conceptually from Reactive Forms?**
A: In Signal Forms the source of truth is a writable signal that holds your model, and `form()` creates a typed field tree over it; field state like value, validity and touched is exposed as signals, and validation is declared in a schema function. In Reactive Forms the source of truth is a `FormGroup`/`FormControl` tree that you build explicitly, and changes are exposed as observables.

**Q: What is lazy loading of routes and why use it?**
A: With `loadComponent` or `loadChildren` and a dynamic import, the code for a route is split into a separate chunk and downloaded only when the user navigates there. It reduces the initial bundle size and startup time.

## Done when

- [ ] `/shipments/new` відкривається через nav і прямим URL.
- [ ] Валідна форма додає посилку в store і повертає на `/shipments`.
- [ ] Route `shipments/new` стоїть перед `shipments/:id` і використовує `loadComponent`.
- [ ] Можеш пояснити, чому посилка зникає після reload.

---
Docs: [Signal Forms overview](https://angular.dev/guide/forms/signals/overview) · [Form models](https://angular.dev/guide/forms/signals/models) · [Lazy loading routes](https://angular.dev/guide/routing/define-routes#lazily-loaded-components-and-routes)

[← Попередній: Route parameters: сторінка ShipmentDetails](02-route-params-details.md) · [Наступний: Validation, повідомлення про помилки та submit →](04-validation-and-submit.md)
