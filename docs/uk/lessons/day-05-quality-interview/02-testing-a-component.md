# Day 5 · Lesson 2 — Unit test компонента: ShipmentCard

[English](../../../en/lessons/day-05-quality-interview/02-testing-a-component.md) | **Українська**

**Estimated time:** 10 хв · **Time budget:** read 2 · code 4 · try 3 · verify 1

**Learning outcome:** протестувати presentational component: задати signal input через `setInput`, перевірити DOM і подію `output()`.

[← Попередній: Unit test сервісу: ShipmentStore](01-testing-a-service.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Production structure та common mistakes →](03-production-structure-and-mistakes.md)

## Why it matters

Presentational components з `input()` / `output()` тестуються як чиста функція «дані → DOM, клік → подія». Це стандартний приклад component test на співбесіді та найстабільніший тип UI-тестів у production.

## Concept

- `TestBed.createComponent(X)` повертає **`ComponentFixture`**: `componentInstance` (клас), `nativeElement` (DOM), `componentRef` (API для inputs).
- **Signal inputs** задаються ззовні: `fixture.componentRef.setInput('shipment', value)`. Присвоїти `component.shipment = …` не можна — це read-only signal. `input.required()` треба задати **до** першого рендеру, інакше помилка `NG0950`.
- **Рендер.** TestBed у v22 zoneless за замовчуванням: після зміни стану чекайте `await fixture.whenStable()`. `fixture.detectChanges()` — старіший ручний стиль; у новому коді його уникають.
- **Outputs.** `component.delivered.subscribe(...)` — підписка на `OutputEmitterRef` прямо в тесті.
- **Залежності шаблону.** `ShipmentCard` містить `RouterLink`, тому тесту потрібен `provideRouter([])`; без нього — `NG0201: No provider found for ActivatedRoute`.

React-паралель: React Testing Library `render(<Card shipment={…} onDelivered={spy} />)`. Відмінність: Angular-тест іде через DI-контейнер (TestBed), тому залежності шаблону треба надати явно.

## Follow along

1. Створіть `src/app/features/shipments/shipment-card/shipment-card.spec.ts`:

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

2. Запустіть `npx ng test --no-watch --no-progress` — обидва тести зелені.

3. Закоментуйте `providers: [provideRouter([])]`, перезапустіть і знайдіть у виводі `NG0201`. Поверніть provider. Так виглядає типова помилка «в шаблоні є директива, якій потрібен сервіс».

## Try it yourself

Додайте третій тест: для посилки зі статусом `DELIVERED` кнопки в картці **немає**.

Hints:

- Не створюйте новий fixture: викличте `setInput` ще раз із копією об'єкта (`{ ...SHIPMENT, status: 'DELIVERED' }`) — саме так батьківський компонент передає нове значення.
- Після зміни input DOM оновлюється асинхронно — що треба зробити перед `expect`?

## Verify / Expected result

```bash
npx ng test --no-watch --no-progress
```

- `shipment-card.spec.ts` — 3 тести passed; разом з попереднім уроком і `app.spec.ts` жодного failed.
- Еталон після власної спроби: `../app/src/app/features/shipments/shipment-card/shipment-card.spec.ts`. Повний прогін reference-проєкту `app/`: **4 test files, 11 tests passed**.
- *Optional / Outside 5-hour course:* у `app/` є ще `shipment-form/shipment-form.spec.ts` — приклад тесту Signal Form (заповнення полів, submit, `vi.spyOn(router, 'navigate')`). Лише для читання.

## Common mistake / Best practice

**Пастка:** перевіряти DOM одразу після `setInput(...)` без `await fixture.whenStable()`. Наслідок: assert бачить старий DOM, тест падає або, гірше, проходить випадково (наприклад, перевірка «елемента немає»). **Правильно:** змінили стан → `await fixture.whenStable()` → `expect`. І тестуйте поведінку через DOM та outputs, а не через `protected`-поля компонента.

## Interview checkpoint

**Q: How do you test a component with signal inputs and outputs?**

A: I create it with `TestBed.createComponent`, set inputs with `fixture.componentRef.setInput`, wait for `fixture.whenStable()`, and assert on the rendered DOM. For outputs I subscribe to the output in the test, trigger the DOM event, and check the emitted value.

**Q: What is the difference between `whenStable()` and `detectChanges()`?**

A: `detectChanges()` forces a synchronous change detection run manually. `whenStable()` waits until Angular itself has finished rendering, which matches how the app behaves in zoneless mode, so it is the preferred way in modern tests.

## Done when

- [ ] `shipment-card.spec.ts` містить тести на рендер і на `delivered`.
- [ ] Ви самостійно додали тест для статусу `DELIVERED`.
- [ ] `npx ng test --no-watch --no-progress` — 0 failed.
- [ ] Можете пояснити, навіщо в тесті `provideRouter([])` і `setInput`.

---

Docs: [Component testing basics](https://angular.dev/guide/testing/components-basics) · [Component testing scenarios](https://angular.dev/guide/testing/components-scenarios) · [Zoneless: testing](https://angular.dev/guide/zoneless)

[← Попередній: Unit test сервісу: ShipmentStore](01-testing-a-service.md) · [Наступний: Production structure та common mistakes →](03-production-structure-and-mistakes.md)
