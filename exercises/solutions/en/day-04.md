# Day 4 — Solutions (Try it yourself)

**English** | [Українська](../uk/day-04.md)

> ⚠️ Don't read ahead. Open a section only after your own attempt at the task of the corresponding lesson.
> These solutions are **not part** of the reference `app/` — they are small additional exercises.

## Lesson 1 — the `/about` page

```bash
npx ng generate component features/about --inline-template --inline-style --skip-tests
```

`src/app/app.routes.ts` — a new entry **before** the wildcard:

```ts
import { About } from './features/about/about';
// ...
{ path: 'about', component: About, title: 'About · ParcelFlow Lite' },
{ path: '**', redirectTo: 'shipments' },
```

`src/app/app.html` — in `nav`:

```html
<a routerLink="/about" routerLinkActive="active" ariaCurrentWhenActive="page">About</a>
```

If you put the route after `'**'`, it will never match: the wildcard matches any URL first.

## Lesson 2 — the "Next shipment →" link

`shipment-details.ts`:

```ts
protected readonly nextShipment = computed(() =>
  this.store.shipments().find((s) => s.id === Number(this.id()) + 1),
);
```

`shipment-details.html` (inside the `@else if (shipment(); as shipment)` branch):

```html
@if (nextShipment(); as next) {
  <p><a [routerLink]="['/shipments', next.id]">Next shipment →</a></p>
}
```

What to observe: when navigating `/shipments/1` → `/shipments/2`, the Router reuses the same `ShipmentDetails` instance; only the `id` input changes, and both `computed` values are recalculated. With `ActivatedRoute.snapshot` the page would stay on the old data.

## Lesson 3 — live preview of the model and Reset

`shipment-form.ts`:

```ts
import { JsonPipe } from '@angular/common';
// ...
imports: [FormField, FormRoot, RouterLink, JsonPipe],
// ...
protected reset(): void {
  this.model.set({ trackingNumber: '', carrier: '' });
}
```

`shipment-form.html`:

```html
<!-- in .actions -->
<button type="button" (click)="reset()">Reset</button>

<!-- below the form -->
<pre>{{ model() | json }}</pre>
```

Typing into a field immediately changes `model()`, and `model.set(...)` immediately clears the inputs: the form has no copy of the data of its own.

## Lesson 4 — the reserved number `PF-0000`

In the schema function of `shipment-form.ts`:

```ts
validate(path.trackingNumber, ({ value }) =>
  value() === 'PF-0000'
    ? { kind: 'reserved', message: 'PF-0000 is reserved and cannot be used.' }
    : null,
);
```

The template does not need to change: the `@for` over `errors()` will show the new error automatically. This is exactly why it is convenient to keep the message next to the rule rather than in the template.

## Lesson 5 — live preview through `valueChanges`

`shipment-form-reactive.ts`:

```ts
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
// ...
imports: [ReactiveFormsModule, JsonPipe],
// ...
// declare AFTER the form field
protected readonly value = toSignal(this.form.valueChanges, {
  initialValue: this.form.getRawValue(),
});
```

In the template below the form:

```html
<pre>{{ value() | json }}</pre>
```

`valueChanges` is a "never-ending" Observable (it does not complete on its own), so a manual `subscribe()` without unsubscribing would cause a memory leak; `toSignal` unsubscribes when the component is destroyed.
