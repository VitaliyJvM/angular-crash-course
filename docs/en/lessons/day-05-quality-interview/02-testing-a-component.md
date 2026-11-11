# Day 5 · Lesson 2 — Unit testing a component: ShipmentCard

**English** | [Українська](../../../uk/lessons/day-05-quality-interview/02-testing-a-component.md)

**Estimated time:** 10 min · **Time budget:** read 2 · code 4 · try 3 · verify 1

**Learning outcome:** test a presentational component: set a signal input with `setInput`, check the DOM and the `output()` event.

[← Previous: Unit testing a service: ShipmentStore](01-testing-a-service.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Production structure and common mistakes →](03-production-structure-and-mistakes.md)

## Why it matters

Presentational components with `input()` / `output()` are tested like a pure function: "data → DOM, click → event". This is the standard component test example in interviews and the most stable kind of UI test in production.

## Concept

- `TestBed.createComponent(X)` returns a **`ComponentFixture`**: `componentInstance` (the class), `nativeElement` (the DOM), `componentRef` (the API for inputs).
- **Signal inputs** are set from the outside: `fixture.componentRef.setInput('shipment', value)`. You cannot assign `component.shipment = …` — it is a read-only signal. `input.required()` must be set **before** the first render, otherwise you get error `NG0950`.
- **Rendering.** TestBed in v22 is zoneless by default: after a state change, wait with `await fixture.whenStable()`. `fixture.detectChanges()` is the older manual style; new code avoids it.
- **Outputs.** `component.delivered.subscribe(...)` — a subscription to the `OutputEmitterRef` right in the test.
- **Template dependencies.** `ShipmentCard` contains `RouterLink`, so the test needs `provideRouter([])`; without it you get `NG0201: No provider found for ActivatedRoute`.

React parallel: React Testing Library `render(<Card shipment={…} onDelivered={spy} />)`. The difference: an Angular test goes through the DI container (TestBed), so the template's dependencies must be provided explicitly.

## Follow along

1. Create `src/app/features/shipments/shipment-card/shipment-card.spec.ts`:

   ```ts
   import { ComponentFixture, TestBed } from '@angular/core/testing';
   import { provideRouter } from '@angular/router';
   import { Shipment } from '../shipment.model';
   import { ShipmentCard } from './shipment-card';

   const SHIPMENT: Shipment = {
     id: 7,
     trackingNumber: 'PF-7777',
     carrier: 'DHL',
     status: 'IN_TRANSIT',
     createdAt: '2026-11-02T09:15:00Z',
   };

   describe('ShipmentCard', () => {
     let fixture: ComponentFixture<ShipmentCard>;
     let element: HTMLElement;

     beforeEach(async () => {
       TestBed.configureTestingModule({ providers: [provideRouter([])] }); // the card uses RouterLink
       fixture = TestBed.createComponent(ShipmentCard);
       fixture.componentRef.setInput('shipment', SHIPMENT); // required input must be set before first render
       await fixture.whenStable();
       element = fixture.nativeElement;
     });

     it('renders the tracking number and status', () => {
       expect(element.textContent).toContain('PF-7777');
       expect(element.querySelector('.status')?.textContent).toContain('IN_TRANSIT');
     });

     it('emits the shipment id when "Mark delivered" is clicked', () => {
       const emitted: number[] = [];
       fixture.componentInstance.delivered.subscribe((id) => emitted.push(id));

       element.querySelector('button')?.click();

       expect(emitted).toEqual([7]);
     });
   });
   ```

2. Run `npx ng test --no-watch --no-progress` — both tests are green.

3. Comment out `providers: [provideRouter([])]`, rerun and find `NG0201` in the output. Restore the provider. This is what the typical "the template has a directive that needs a service" error looks like.

## Try it yourself

Add a third test: for a shipment with status `DELIVERED` the card has **no** button.

Hints:

- Do not create a new fixture: call `setInput` again with a copy of the object (`{ ...SHIPMENT, status: 'DELIVERED' }`) — this is exactly how a parent component passes a new value.
- After an input changes, the DOM updates asynchronously — what do you need to do before `expect`?

## Verify / Expected result

```bash
npx ng test --no-watch --no-progress
```

- `shipment-card.spec.ts` — 3 tests passed; together with the previous lesson and `app.spec.ts`, none failed.
- Reference after your own attempt: `../app/src/app/features/shipments/shipment-card/shipment-card.spec.ts`. A full run of the `app/` reference project: **4 test files, 11 tests passed**.
- *Optional / Outside 5-hour course:* `app/` also has `shipment-form/shipment-form.spec.ts` — an example of a Signal Form test (filling in fields, submit, `vi.spyOn(router, 'navigate')`). Read only.

## Common mistake / Best practice

**Pitfall:** checking the DOM right after `setInput(...)` without `await fixture.whenStable()`. Consequence: the assert sees the old DOM, and the test fails or, worse, passes by accident (for example, an "element is absent" check). **Correct:** change the state → `await fixture.whenStable()` → `expect`. And test behavior through the DOM and outputs, not through the component's `protected` fields.

## Interview checkpoint

**Q: How do you test a component with signal inputs and outputs?**

A: I create it with `TestBed.createComponent`, set inputs with `fixture.componentRef.setInput`, wait for `fixture.whenStable()`, and assert on the rendered DOM. For outputs I subscribe to the output in the test, trigger the DOM event, and check the emitted value.

**Q: What is the difference between `whenStable()` and `detectChanges()`?**

A: `detectChanges()` forces a synchronous change detection run manually. `whenStable()` waits until Angular itself has finished rendering, which matches how the app behaves in zoneless mode, so it is the preferred way in modern tests.

## Done when

- [ ] `shipment-card.spec.ts` contains tests for rendering and for `delivered`.
- [ ] You added the test for the `DELIVERED` status on your own.
- [ ] `npx ng test --no-watch --no-progress` — 0 failed.
- [ ] You can explain why the test needs `provideRouter([])` and `setInput`.

---

Docs: [Component testing basics](https://angular.dev/guide/testing/components-basics) · [Component testing scenarios](https://angular.dev/guide/testing/components-scenarios) · [Zoneless: testing](https://angular.dev/guide/zoneless)

[← Previous: Unit testing a service: ShipmentStore](01-testing-a-service.md) · [Next: Production structure and common mistakes →](03-production-structure-and-mistakes.md)
