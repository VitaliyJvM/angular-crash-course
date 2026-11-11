# Day 1 · Lesson 5 — Template bindings

**English** | [Українська](../../../uk/lessons/day-01-fundamentals/05-template-bindings.md)

**Estimated time:** 10 min · **Time budget:** read 3 · code 4 · try 2 · verify 1

**Learning outcome:** you use interpolation, property binding, class binding and event binding, and you can read this syntax in other people's code.

[← Previous: First component: ShipmentList](04-first-component.md) · [Course plan](../../COURSE-PLAN.md) · [Next: NgModules vs Standalone →](06-ngmodules-vs-standalone.md)

## Why it matters

Bindings are all the "glue" between the component class and the DOM. Four forms of syntax cover 95% of the templates you will see in production code.

## Concept

| Binding | Angular | React (JSX) |
|---------|---------|-------------|
| Text | `{{ carrier }}` | `{carrier}` |
| DOM property | `[disabled]="isFull()"` | `disabled={isFull}` |
| Attribute | `[attr.aria-label]="label"` | `aria-label={label}` |
| CSS class | `[class.full]="isFull()"` | `className={isFull ? 'full' : ''}` |
| Event | `(click)="addParcel()"` | `onClick={addParcel}` |

Reading rules: **`[ ]` — data flows into the element, `( )` — events flow out of the element.** The expression in quotes is not a string but a TypeScript-like expression evaluated in the context of the component class.

A signal is read in a template by calling it: `{{ parcelCount() }}`. Angular remembers that this binding depends on the signal and updates it when the value changes.

> Caveat: a template is not JSX. You cannot write arbitrary JavaScript here (`map`, variable declarations, `new`); for branching and loops there is the dedicated `@if` / `@for` syntax (Day 2). Class members used by the template must be `public` or `protected`, not `private`.

## Follow along

1. Replace the content of `src/app/features/shipments/shipment-list/shipment-list.ts`:

   ```ts
   import { Component, signal } from '@angular/core';

   @Component({
     imports: [],
     selector: 'app-shipment-list',
     styleUrl: './shipment-list.css',
     templateUrl: './shipment-list.html',
   })
   export class ShipmentList {
     protected readonly carrier = 'Nova Poshta';
     protected readonly maxParcels = 5;
     protected readonly parcelCount = signal(3);

     protected addParcel(): void {
       this.parcelCount.update((count) => count + 1);
     }
   }
   ```

2. Replace the content of `shipment-list.html`:

   ```html
   <h2>Shipments</h2>

   <p>
     Carrier: <strong>{{ carrier }}</strong>, parcels: <strong>{{ parcelCount() }}</strong>
   </p>

   <button
     type="button"
     [disabled]="parcelCount() >= maxParcels"
     [class.full]="parcelCount() >= maxParcels"
     (click)="addParcel()"
   >
     Add parcel
   </button>
   ```

3. Add to `shipment-list.css`:

   ```css
   .full {
     border-color: var(--danger);
   }
   ```

4. In the browser, click **Add parcel** twice: the counter becomes 5, and the button becomes disabled with a red border.

## Try it yourself

Add a second button, **Reset**, that returns the counter to 3 and is enabled only when the counter is greater than 3.

Hint: a signal has a `set(value)` method.

## Verify / Expected result

- After two clicks: `parcels: 5`, **Add parcel** is disabled.
- **Reset** returns `parcels: 3`, enables **Add parcel** again and becomes disabled itself.
- There are no compilation errors in the terminal running `ng serve`.

## Common mistake / Best practice

**Mistake:** writing `disabled="{{ isFull }}"` or `disabled="false"` by analogy with HTML. **Consequence:** the `disabled` attribute is always present (any string, even `"false"`, turns it on), so the button is blocked forever. **Correct:** for non-text values use property binding `[disabled]="expr"`.

**Best practice:** declare class members used by the template as `protected readonly` — the template has access, and outside code cannot change them.

## Interview checkpoint

**Q: What kinds of data binding does Angular have?**

A: Interpolation `{{ }}` for text, property binding `[prop]` for passing values into elements or components, event binding `(event)` for reacting to events, and two-way binding `[(x)]`, which combines both. Data flows down through properties and up through events.

**Q: What is the difference between `[disabled]="x"` and `disabled="x"`?**

A: With brackets Angular evaluates `x` as an expression and sets the DOM property. Without brackets it is a static HTML attribute with the literal string value.

## Done when

- [ ] Interpolation, property binding, class binding and event binding are all in your template.
- [ ] **Add parcel** is blocked at 5, and **Reset** works.
- [ ] You can explain the difference between `[ ]` and `( )` in one sentence.

---
Docs: [Binding dynamic text, properties and attributes](https://angular.dev/guide/templates/binding) · [Adding event listeners](https://angular.dev/guide/templates/event-listeners)

[← Previous: First component: ShipmentList](04-first-component.md) · [Next: NgModules vs Standalone →](06-ngmodules-vs-standalone.md)
