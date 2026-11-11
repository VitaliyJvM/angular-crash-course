# Day 5 — Solutions

> **Не читайте наперед.** Відкривайте розділ лише після власної спроби виконати відповідний блок *Try it yourself*.

## Lesson 1 — тести error path та `add()` для `ShipmentStore`

Еталон — два останні тести у файлі
[`app/src/app/features/shipments/shipment-store.spec.ts`](../../app/src/app/features/shipments/shipment-store.spec.ts):

- `exposes an error message when the request fails`
- `adds a shipment in memory with the next id and CREATED status`

Ключові моменти:

- помилкова відповідь: `http.expectOne('data/shipments.json').flush('Not found', { status: 404, statusText: 'Not Found' })`;
- `add()` перевіряється після успішного `load` + `flush`, інакше `id` буде `1`, а не `3`.

## Lesson 2 — тест «немає кнопки для `DELIVERED`»

Еталон — тест `hides the button for delivered shipments` у
[`app/src/app/features/shipments/shipment-card/shipment-card.spec.ts`](../../app/src/app/features/shipments/shipment-card/shipment-card.spec.ts).

Ключові моменти:

- новий об'єкт через `fixture.componentRef.setInput('shipment', { ...SHIPMENT, status: 'DELIVERED' })`;
- `await fixture.whenStable()` перед `expect`, тому тест — `async`.

## Lesson 4 — експеримент з `[innerHTML]`

Рендериться зламане зображення без атрибута `onerror`; `alert` не спрацьовує; у консолі —
`WARNING: sanitizing HTML stripped some content`. Після експерименту шаблон має повернутись до інтерполяції `{{ event.description }}`.

## Lessons 3, 5, 7

Усні завдання; модельні відповіді — у блоках *Interview checkpoint* відповідних уроків і в
[`docs/reference/interview-questions.md`](../../docs/reference/interview-questions.md).

## Lesson 6 — Final challenge

Окремий файл: [final-challenge.md](final-challenge.md).

## Optional reading

[`app/src/app/features/shipments/shipment-form/shipment-form.spec.ts`](../../app/src/app/features/shipments/shipment-form/shipment-form.spec.ts) — тест Signal Form (*Optional / Outside 5-hour course*).
