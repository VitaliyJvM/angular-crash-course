# Day 4 · Lesson 4 — Validation, error messages and submit

**English** | [Українська](../../../uk/lessons/day-04-routing-forms/04-validation-and-submit.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 5 · try 2 · verify 1

**Learning outcome:** the form checks the format and uniqueness of the tracking number, shows accessible error messages and does not add invalid data.

[← Previous: Signal Forms: the create-shipment form](03-signal-forms-basics.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Signal Forms vs Reactive Forms vs template-driven →](05-forms-comparison-reactive.md)

## Why it matters

Client-side validation is UX, not security: it gives instant feedback, but the server still validates the data again. The quality of a form is defined by when and how the user sees an error.

## Concept

In Signal Forms, rules are declared in the schema function and bound to the field's **path**:

```ts
required(path.trackingNumber, { message: 'Tracking number is required.' });
pattern(path.trackingNumber, /^PF-\d{4}$/, { message: 'Use the format PF-0000.' });
validate(path.trackingNumber, ({ value }) =>
  value() === 'PF-0000' ? { kind: 'reserved', message: 'Reserved number.' } : null,
);
```

- Built-in: `required`, `pattern`, `minLength`, `maxLength`, `min`, `max`, `email`.
- `validate(path, fn)` — a custom rule: it returns `null` or an error `{ kind, message }`. The function is reactive: if it reads signals (the field value, data from the store), the errors are recomputed automatically.
- Async checks (`validateHttp`, `validateAsync`) — **Optional / Outside 5-hour course**.
- Field state is exposed as signals: `field().errors()`, `.invalid()`, `.touched()`, `.dirty()`.

Signal Forms **do not use** the built-in browser constraint validation (`FormRoot` sets `novalidate`), so all rules and messages live in your code.

React parallel: Zod schema + `formState.errors` in React Hook Form ≈ schema function + `field().errors()`. Caveat: here errors are signals, so the template updates without extra subscriptions or a re-render of the whole form.

## Follow along

1. Add to `shipment-store.ts` (before `add`):

   ```ts
   hasTrackingNumber(trackingNumber: string): boolean {
     return this._shipments().some((s) => s.trackingNumber === trackingNumber);
   }
   ```

2. In `shipment-form/shipment-form.ts` update the import and the schema, and add a constructor:

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

   The validator reads a signal from the store, so the "uniqueness" rule sits next to the other rules rather than in the submit handler.

3. In `shipment-form.html` add the `aria-describedby` attribute to the `<input>` and an error block right after it:

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

4. The same for the `<select>`:

   ```html
   <select id="carrier" aria-describedby="carrier-errors" [formField]="shipmentForm.carrier">
     <!-- options unchanged -->
   </select>
   <div id="carrier-errors" aria-live="polite">
     @if (shipmentForm.carrier().touched() && shipmentForm.carrier().invalid()) {
       @for (error of shipmentForm.carrier().errors(); track error.kind) {
         <p class="error">{{ error.message }}</p>
       }
     }
   </div>
   ```

   - `touched() && invalid()` — the error appears after the user has left the field, not while typing the first character.
   - `aria-describedby` links the field to the error text, and `aria-live="polite"` makes a screen reader announce it when it appears. The container always exists — only its content changes.

5. We **do not make the submit button `disabled`**. Submitting an invalid form marks all fields as touched, so the user immediately sees all the errors, and `action` is not called. A disabled button does not explain what exactly is wrong and works worse with the keyboard and screen readers.

## Try it yourself

Add one more business rule: the number `PF-0000` is reserved and cannot be used (its own `kind`, its own message).

- Hint: one more `validate(...)` call for the same `path.trackingNumber`; check whether two errors are shown at the same time when several rules are violated.

## Verify / Expected result

- Clicking `Add shipment` on an empty form → `Tracking number is required.` and `Choose a carrier.` appear below the fields; nothing is added to the list.
- `abc` → after leaving the field, `Use the format PF-0000.`
- `PF-1001` → `This tracking number already exists.`
- `PF-2000` + carrier → the shipment is added, redirect to `/shipments`.
- Reload on `/shipments/new` and enter `PF-1001` — the duplicate check works (thanks to `store.load()`).

## Common mistake / Best practice

**Pitfall:** showing errors based on `invalid()` alone. Consequence: a freshly opened empty form is already all red — the user has not done anything yet and is already being "told off". **Correct:** combine it with `touched()` (or `dirty()`), and on submit rely on the form itself marking the fields as touched.

## Interview checkpoint

**Q: How do you implement custom validation in Signal Forms?**

A: Inside the schema function you call `validate()` with the field path and a function that receives the field context and returns either `null` or an error object with a `kind` and a `message`. Because the validator runs in a reactive context, it re-evaluates whenever any signal it reads changes, including other fields or application state.

**Q: Is client-side form validation enough?**

A: No. It only improves user experience. The client can be bypassed, so the server must validate everything again; server-side errors can then be mapped back onto form fields.

## Done when

- [ ] An empty form shows both `required` messages after submit.
- [ ] A wrong format and a duplicate produce separate, clear messages.
- [ ] The fields have `aria-describedby`, and the error containers have `aria-live`.
- [ ] You can explain why the submit button is not `disabled`.

---
Docs: [Signal Forms validation](https://angular.dev/guide/forms/signals/validation) · [Field state management](https://angular.dev/guide/forms/signals/field-state-management) · [Form submission](https://angular.dev/guide/forms/signals/form-submission)

[← Previous: Signal Forms: the create-shipment form](03-signal-forms-basics.md) · [Next: Signal Forms vs Reactive Forms vs template-driven →](05-forms-comparison-reactive.md)
