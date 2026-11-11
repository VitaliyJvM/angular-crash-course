# Day 5 · Lesson 6 — Final challenge: видалення посилки

[English](../../../en/lessons/day-05-quality-interview/06-final-challenge.md) | **Українська**

**Estimated time:** 15 хв · **Time budget:** read 2 · code 10 · verify 3

**Learning outcome:** самостійно, без покрокової інструкції, провести нову функцію через усі шари: store → presentational component → page component → unit test.

[← Попередній: Angular vs React: decision guide](05-angular-vs-react-decision-guide.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Interview review →](07-interview-review.md)

## Why it matters

Типова робоча задача й типове live-coding завдання: «додайте дію до елемента списку». Вона перевіряє розуміння data flow (inputs down, events up), immutable updates у signals і вміння не зламати наявні тести.

## Concept

Нової теорії немає. Задача використовує лише те, що вже є в проєкті:

- state-операція у `ShipmentStore` за зразком `markDelivered` (Day 3);
- `output()` у `ShipmentCard` за зразком `delivered` (Day 2);
- обробка події у `ShipmentList` (Day 2–3);
- тест store з `HttpTestingController` (Lesson 1).

Видалення, як і додавання, відбувається **лише в пам'яті**: backend немає, після оновлення сторінки список повертається до вмісту `shipments.json`.

## Follow along

Це не покрокове рішення, а вимоги й рекомендований порядок.

**Required:**

1. **Store.** `ShipmentStore.remove(id: number): void` — прибирає посилку зі списку. Невідомий `id` нічого не змінює і не кидає помилку.
2. **Card → List.** У `ShipmentCard` з'являється кнопка **Delete** і новий `removed = output<number>()`. Картка сама нічого не видаляє. `ShipmentList` обробляє подію викликом `store.remove($event)`. Лічильники `Total / In transit / Delivered` оновлюються без додаткового коду.
3. **Test.** Один unit test для `remove` у `shipment-store.spec.ts`.

**Рекомендований порядок:** store → тест store (червоний/зелений) → card → list → повний прогін тестів → перевірка в браузері.

**Stretch (Optional / Outside 5-hour course):** фільтр за перевізником — `<select>` у `ShipmentList` (варіанти з `CARRIERS` + «усі»), який комбінується зі статус-фільтром і пошуком **усередині наявного** `computed` `filteredShipments`. Має `<label>`.

## Try it yourself

Виконайте Required-частину у своєму `practice/` за 10 хвилин, не відкриваючи `exercises/solutions/uk/final-challenge.md`.

Hints:

- Після додавання другої кнопки в картку один із тестів `shipment-card.spec.ts` може впасти. Це очікувано: вирішіть, що саме той тест мав гарантувати, і виправте **тест**, а не розмітку заради тесту.
- Якщо лічильники не оновились після видалення — перевірте, чи повертає `remove` новий масив.

## Verify / Expected result

```bash
npx ng test --no-watch
npx ng build
```

- Усі тести зелені, включно з новим тестом `remove`; build без помилок.
- У браузері: **Delete** на картці прибирає її зі списку, `Total` зменшується на 1; видалення `IN_TRANSIT`-посилки зменшує і `In transit`.
- Після видалення перехід за прямим URL видаленої посилки (`/shipments/<id>`) показує `Shipment #<id> not found.` — без змін у `ShipmentDetails`.
- Кнопка **Delete** досяжна через `Tab` і спрацьовує на `Enter`.
- Оновлення сторінки повертає початкові 5 посилок (in-memory, це очікувано).
- Self-review: у `ShipmentCard` немає `inject(ShipmentStore)`; у `remove` немає `splice`/`push`.

Після власної спроби порівняйте з [exercises/solutions/final-challenge.md](../../../../exercises/solutions/uk/final-challenge.md).

## Common mistake / Best practice

**Пастка:** заінжектити `ShipmentStore` прямо в `ShipmentCard` і викликати `store.remove()` з картки — «так коротше». Наслідок: presentational component отримує приховану залежність, його не можна перевикористати (наприклад, у списку архіву, де Delete означає інше) і для тесту вже потрібен mock store та HTTP. **Правильно:** картка лише емітить `removed`, рішення приймає page component — так само, як із `delivered`.

## Interview checkpoint

**Q: Walk me through how you would add a "delete item" feature in an Angular app.**

A: I add a `remove` method to the state service that updates the signal immutably, cover it with a unit test, then add an output to the presentational item component and handle it in the page component by calling the service. Derived values like counters are `computed`, so they update automatically. With a real backend the service would call the API and update state on success, or optimistically with rollback on error.

**Q: Why should the card emit an event instead of calling the service itself?**

A: It keeps the component presentational: it depends only on its inputs and outputs, so it is reusable and trivial to test. The parent decides what the event means.

## Done when

- [ ] `ShipmentStore.remove(id)` реалізовано через immutable update.
- [ ] `ShipmentCard` має кнопку Delete та `removed = output<number>()`; `ShipmentList` викликає `store.remove($event)`.
- [ ] У `shipment-store.spec.ts` є тест для `remove`, і він зелений.
- [ ] `npx ng test --no-watch` і `npx ng build` проходять без помилок.
- [ ] (Optional) фільтр за перевізником працює разом зі статус-фільтром і пошуком.

---

Docs: [Outputs](https://angular.dev/guide/components/outputs) · [Signals](https://angular.dev/guide/signals) · [Testing services](https://angular.dev/guide/testing/services)

[← Попередній: Angular vs React: decision guide](05-angular-vs-react-decision-guide.md) · [Наступний: Interview review →](07-interview-review.md)
