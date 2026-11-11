# Day 4 · Lesson 5 — Signal Forms vs Reactive Forms vs template-driven

[English](../../../en/lessons/day-04-routing-forms/05-forms-comparison-reactive.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** та сама форма працює на Reactive Forms за `/shipments/new-reactive`, і ти можеш пояснити три підходи до форм та аргументувати вибір.

[← Попередній: Validation, повідомлення про помилки та submit](04-validation-and-submit.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Unit test сервісу: ShipmentStore →](../day-05-quality-interview/01-testing-a-service.md)

## Why it matters

Signal Forms стабільні лише з Angular 22, тому переважна більшість наявних enterprise-codebases і питань на співбесідах — про Reactive Forms. Тобі потрібно впевнено читати `FormGroup`/`FormControl` і пояснювати, чим підходи відрізняються.

## Concept

| | Signal Forms | Reactive Forms | Template-driven |
| --- | --- | --- | --- |
| Source of truth | твій writable signal з моделлю | дерево `FormGroup` / `FormControl` | модель у компоненті, форму будують директиви |
| Опис форми | `form(model, schema)` у класі | `FormBuilder.group({...})` у класі | у template (`ngModel`) |
| Validation | schema-функція, правила за шляхом | `Validators.*` на кожному control | атрибути-директиви (`required`, `pattern`) |
| Реактивність | signals | Observables (`valueChanges`, `statusChanges`) | керується Angular, async |
| Type safety | виводиться з моделі | typed forms (явно, з нюансами nullable) | мінімальна |
| Статус | stable з v22 | stable, усталений enterprise-стандарт | stable |
| Найкраще для | нових signal-based застосунків | наявних codebases, складних динамічних форм | простих форм (login, search) |

**Як обирати.** Новий застосунок на Angular 22+ із signals → Signal Forms. Наявний проєкт на Reactive Forms → залишатися на них: вони повністю підтримуються, а переписувати працюючі форми без причини не варто. Template-driven — лише для найпростіших форм; логіка в template погано тестується й масштабується.

Template-driven для впізнавання (лише читаємо, в застосунок **не додаємо**):

```ts
@Component({
  imports: [FormsModule],
  template: `
    <form #f="ngForm" (ngSubmit)="save()">
      <input name="trackingNumber" [(ngModel)]="trackingNumber" required pattern="PF-\\d{4}" />
      <button type="submit" [disabled]="f.invalid">Add</button>
    </form>
  `,
})
export class QuickForm {
  trackingNumber = '';
  save() { /* ... */ }
}
```

React-паралель: Reactive Forms ≈ React Hook Form / Formik (стан форми в окремому об'єкті, а не в полях компонента); template-driven ≈ прості controlled inputs з `useState`. Застереження: в Angular усі три підходи — офіційна частина фреймворку, тож у різних командах вони виглядають однаково.

## Follow along

1. Створи вручну файл `src/app/features/shipments/shipment-form-reactive/shipment-form-reactive.ts`:

   ```ts
   import { Component, inject } from '@angular/core';
   import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
   import { Router } from '@angular/router';
   import { ShipmentStore } from '../shipment-store';
   import { CARRIERS } from '../shipment.model';

   /**
    * Compact Reactive Forms version of ShipmentForm, kept for comparison only.
    * This is the approach you will meet in most existing enterprise codebases.
    */
   @Component({
     imports: [ReactiveFormsModule],
     selector: 'app-shipment-form-reactive',
     template: `
       <h2>New shipment (Reactive Forms)</h2>

       <form [formGroup]="form" (ngSubmit)="submit()">
         <p>
           <label for="trackingNumber">Tracking number</label>
           <input id="trackingNumber" type="text" formControlName="trackingNumber" />
           @if (form.controls.trackingNumber.touched && form.controls.trackingNumber.errors; as errors) {
             @if (errors['required']) {
               <span class="error">Tracking number is required.</span>
             } @else if (errors['pattern']) {
               <span class="error">Use the format PF-0000.</span>
             }
           }
         </p>

         <p>
           <label for="carrier">Carrier</label>
           <select id="carrier" formControlName="carrier">
             <option value="">Select a carrier</option>
             @for (carrier of carriers; track carrier) {
               <option [value]="carrier">{{ carrier }}</option>
             }
           </select>
           @if (form.controls.carrier.touched && form.controls.carrier.invalid) {
             <span class="error">Choose a carrier.</span>
           }
         </p>

         <button type="submit">Add shipment</button>
       </form>
     `,
   })
   export class ShipmentFormReactive {
     private readonly store = inject(ShipmentStore);
     private readonly router = inject(Router);

     protected readonly carriers = CARRIERS;

     // The FormGroup owns the form state; validators are attached per control.
     protected readonly form = inject(FormBuilder).nonNullable.group({
       trackingNumber: ['', [Validators.required, Validators.pattern(/^PF-\d{4}$/)]],
       carrier: ['', Validators.required],
     });

     protected submit(): void {
       if (this.form.invalid) {
         this.form.markAllAsTouched();
         return;
       }
       this.store.add(this.form.getRawValue());
       this.router.navigate(['/shipments']);
     }
   }
   ```

2. Порівняй із `ShipmentForm` — на що звернути увагу:
   - стан належить `FormGroup`, а не твоєму signal; значення читаємо через `getRawValue()`;
   - `nonNullable` — без нього `reset()` ставить `null` і типи полів стають `string | null`;
   - помилки — об'єкт за ключами (`errors['required']`), тексти повідомлень живуть у template;
   - перевірку `invalid` + `markAllAsTouched()` пишемо вручну (у Signal Forms це робить `FormRoot`);
   - `touched`, `errors`, `invalid` — звичайні властивості, не signals; для реакції на зміни є `valueChanges` (Observable);
   - `router.navigate()` повертає `Promise<boolean>`. Тут його навмисно не очікують (`await`), бо після нього нічого немає (`ShipmentForm` робить `await` усередині `async` action). Якщо у вашому lint увімкнено `no-floating-promises`, напишіть `void this.router.navigate(...)` або зробіть `submit()` `async` і додайте `await`.

3. Додай route у `app.routes.ts` після `shipments/new` і **перед** `shipments/:id`:

   ```ts
   {
     path: 'shipments/new-reactive',
     loadComponent: () =>
       import('./features/shipments/shipment-form-reactive/shipment-form-reactive').then(
         (m) => m.ShipmentFormReactive,
       ),
     title: 'New shipment (Reactive Forms) · ParcelFlow Lite',
   },
   ```

4. Відкрий `http://localhost:4200/shipments/new-reactive` (посилання в nav не додаємо — це порівняльний приклад).

## Try it yourself

Покажи під reactive-формою live preview її значення, використавши `valueChanges` — без ручного `subscribe()`.

- Hint: інструмент interop із Day 3, який перетворює Observable на signal і сам відписується; йому потрібне початкове значення.

## Verify / Expected result

- `/shipments/new-reactive`: submit порожньої форми показує обидві помилки; `abc` → `Use the format PF-0000.`; `PF-3000` + carrier → посилка в списку.
- `npx ng build` показує два окремі lazy chunks: `shipment-form` і `shipment-form-reactive`.
- `npx ng test --no-watch` проходить.
- Reactive-версія свідомо не має duplicate check — подумай, як би ти його додав (custom `ValidatorFn`).

## Common mistake / Best practice

**Пастка:** змішувати підходи на одному control — наприклад, `[(ngModel)]` разом із `formControlName`, або тримати копію значень форми ще й у власних полях компонента. Наслідок: два джерела істини, що розходяться, і важко відтворювані баги. **Правильно:** один підхід на форму й одне джерело істини — `FormGroup` у Reactive Forms, model signal у Signal Forms.

## Interview checkpoint

**Q: What is the difference between template-driven and reactive forms?**

A: Template-driven forms are defined in the template with `ngModel`; Angular creates the form model implicitly, which is fine for simple forms but harder to test and scale. Reactive forms define an explicit `FormGroup`/`FormControl` tree in the component class with synchronous access to values, validators as functions, and observables like `valueChanges`, so they suit complex and dynamic forms.

**Q: Which forms approach would you choose for a new Angular 22 project, and for an existing one?**

A: For a new signal-based app I'd use Signal Forms: the model signal is the single source of truth, types are inferred, and validation lives in a schema. For an existing codebase built on Reactive Forms I'd stay with Reactive Forms — they're stable and fully supported — and adopt Signal Forms incrementally only where it pays off.

## Done when

- [ ] `/shipments/new-reactive` додає посилку так само, як основна форма.
- [ ] Можеш назвати source of truth у кожному з трьох підходів.
- [ ] Можеш пояснити `FormBuilder`, `Validators`, `nonNullable`, `markAllAsTouched()`, `getRawValue()`.
- [ ] Наприкінці Day 4: `npx ng build` і `npx ng test --no-watch` проходять.

---
Docs: [Forms comparison](https://angular.dev/guide/forms/signals/comparison) · [Reactive forms](https://angular.dev/guide/forms/reactive-forms) · [Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)

[← Попередній: Validation, повідомлення про помилки та submit](04-validation-and-submit.md) · [Наступний: Unit test сервісу: ShipmentStore →](../day-05-quality-interview/01-testing-a-service.md)
