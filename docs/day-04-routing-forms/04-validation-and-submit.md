# Day 4 · Lesson 4 — Validation, повідомлення про помилки та submit

**Estimated time:** 10 хв · **Time budget:** read 2 · code 5 · try 2 · verify 1
**Learning outcome:** форма перевіряє формат і унікальність tracking number, показує доступні (accessible) повідомлення про помилки й не додає невалідні дані.

[← Попередній: Signal Forms: форма створення посилки](03-signal-forms-basics.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Signal Forms vs Reactive Forms vs template-driven →](05-forms-comparison-reactive.md)

## Why it matters

Валідація на клієнті — це UX, а не безпека: вона дає миттєвий зворотний зв'язок, але сервер усе одно перевіряє дані повторно. Якість форми визначається тим, коли і як користувач бачить помилку.

## Concept

У Signal Forms правила оголошуються в schema-функції, прив'язані до **шляху** поля:

```ts
required(path.trackingNumber, { message: 'Tracking number is required.' });
pattern(path.trackingNumber, /^PF-\d{4}$/, { message: 'Use the format PF-0000.' });
validate(path.trackingNumber, ({ value }) =>
  value() === 'PF-0000' ? { kind: 'reserved', message: 'Reserved number.' } : null,
);
```

- Вбудовані: `required`, `pattern`, `minLength`, `maxLength`, `min`, `max`, `email`.
- `validate(path, fn)` — custom rule: повертає `null` або помилку `{ kind, message }`. Функція реактивна: якщо читає signals (значення поля, дані зі store), помилки перераховуються автоматично.
- Async-перевірки (`validateHttp`, `validateAsync`) — **Optional / Outside 5-hour course**.
- Стан поля — signals: `field().errors()`, `.invalid()`, `.touched()`, `.dirty()`.

Signal Forms **не використовують** вбудовану browser constraint validation (`FormRoot` ставить `novalidate`), тож усі правила й повідомлення — у твоєму коді.

React-паралель: Zod schema + `formState.errors` у React Hook Form ≈ schema-функція + `field().errors()`. Застереження: тут помилки — signals, тому template оновлюється без додаткових підписок чи re-render усієї форми.

## Follow along

1. Додай у `shipment-store.ts` (перед `add`):

   ```ts
   hasTrackingNumber(trackingNumber: string): boolean {
     return this._shipments().some((s) => s.trackingNumber === trackingNumber);
   }
   ```

2. У `shipment-form/shipment-form.ts` онови import, schema і додай constructor:

   ```ts
   import { form, FormField, FormRoot, pattern, required, validate } from '@angular/forms/signals';
   ```

   ```ts
   (path) => {
     required(path.trackingNumber, { message: 'Tracking number is required.' });
     pattern(path.trackingNumber, /^PF-\d{4}$/, { message: 'Use the format PF-0000.' });
     validate(path.trackingNumber, ({ value }) =>
       this.store.hasTrackingNumber(value())
         ? { kind: 'duplicate', message: 'This tracking number already exists.' }
         : null,
     );
     required(path.carrier, { message: 'Choose a carrier.' });
   },
   ```

   ```ts
   constructor() {
     this.store.load(); // needed for the duplicate check when this page is opened directly
   }
   ```

   Validator читає signal зі store, тому правило «унікальність» лежить поруч з іншими правилами, а не в обробнику submit.

3. У `shipment-form.html` додай до `<input>` атрибут `aria-describedby` і блок помилок одразу після нього:

   ```html
   <input
     id="trackingNumber"
     type="text"
     placeholder="PF-1234"
     aria-describedby="trackingNumber-errors"
     [formField]="shipmentForm.trackingNumber"
   />
   <div id="trackingNumber-errors" aria-live="polite">
     @if (shipmentForm.trackingNumber().touched() && shipmentForm.trackingNumber().invalid()) {
       @for (error of shipmentForm.trackingNumber().errors(); track error.kind) {
         <p class="error">{{ error.message }}</p>
       }
     }
   </div>
   ```

4. Те саме для `<select>`:

   ```html
   <select id="carrier" aria-describedby="carrier-errors" [formField]="shipmentForm.carrier">
     <!-- options без змін -->
   </select>
   <div id="carrier-errors" aria-live="polite">
     @if (shipmentForm.carrier().touched() && shipmentForm.carrier().invalid()) {
       @for (error of shipmentForm.carrier().errors(); track error.kind) {
         <p class="error">{{ error.message }}</p>
       }
     }
   </div>
   ```

   - `touched() && invalid()` — помилка з'являється після того, як користувач залишив поле, а не під час першого символу.
   - `aria-describedby` зв'язує поле з текстом помилки, `aria-live="polite"` змушує screen reader озвучити її появу. Контейнер існує завжди — змінюється лише його вміст.

5. Кнопку submit **не робимо `disabled`**. Submit невалідної форми позначає всі поля як touched, тому користувач одразу бачить усі помилки, а `action` не викликається. Disabled-кнопка не пояснює, що саме не так, і гірше працює з клавіатурою та screen readers.

## Try it yourself

Додай ще одне бізнес-правило: номер `PF-0000` зарезервований і не може бути використаний (власний `kind`, власне повідомлення).

- Hint: ще один виклик `validate(...)` для того самого `path.trackingNumber`; подивись, чи показуються дві помилки одночасно, якщо порушено кілька правил.

## Verify / Expected result

- Клік `Add shipment` на порожній формі → під полями `Tracking number is required.` і `Choose a carrier.`; у списку нічого не додалося.
- `abc` → після виходу з поля `Use the format PF-0000.`
- `PF-1001` → `This tracking number already exists.`
- `PF-2000` + carrier → посилка додана, redirect на `/shipments`.
- Reload на `/shipments/new` і ввід `PF-1001` — duplicate check працює (завдяки `store.load()`).

## Common mistake / Best practice

**Пастка:** показувати помилки за умовою лише `invalid()`. Наслідок: щойно відкрита порожня форма вже вся червона — користувач ще нічого не зробив, а його «сварять». **Правильно:** комбінувати з `touched()` (або `dirty()`), а на submit покладатися на те, що форма сама позначає поля як touched.

## Interview checkpoint

**Q: How do you implement custom validation in Signal Forms?**
A: Inside the schema function you call `validate()` with the field path and a function that receives the field context and returns either `null` or an error object with a `kind` and a `message`. Because the validator runs in a reactive context, it re-evaluates whenever any signal it reads changes, including other fields or application state.

**Q: Is client-side form validation enough?**
A: No. It only improves user experience. The client can be bypassed, so the server must validate everything again; server-side errors can then be mapped back onto form fields.

## Done when

- [ ] Порожня форма показує обидва повідомлення `required` після submit.
- [ ] Неправильний формат і дублікат дають окремі зрозумілі повідомлення.
- [ ] Поля мають `aria-describedby`, контейнери помилок — `aria-live`.
- [ ] Можеш пояснити, чому кнопка submit не `disabled`.

---
Docs: [Signal Forms validation](https://angular.dev/guide/forms/signals/validation) · [Field state management](https://angular.dev/guide/forms/signals/field-state-management) · [Form submission](https://angular.dev/guide/forms/signals/form-submission)

[← Попередній: Signal Forms: форма створення посилки](03-signal-forms-basics.md) · [Наступний: Signal Forms vs Reactive Forms vs template-driven →](05-forms-comparison-reactive.md)
