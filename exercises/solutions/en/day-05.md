# Day 5 — Solutions

**English** | [Українська](../uk/day-05.md)

> **Don't read ahead.** Open a section only after your own attempt at the corresponding *Try it yourself* block.

## Lesson 1 — error path and `add()` tests for `ShipmentStore`

The reference is the last two tests in the file
[`app/src/app/features/shipments/shipment-store.spec.ts`](../../../app/src/app/features/shipments/shipment-store.spec.ts):

- `exposes an error message when the request fails`
- `adds a shipment in memory with the next id and CREATED status`

Key points:

- error response: `http.expectOne('data/shipments.json').flush('Not found', { status: 404, statusText: 'Not Found' })`;
- `add()` is checked after a successful `load` + `flush`, otherwise `id` will be `1` rather than `3`.

## Lesson 2 — the "no button for `DELIVERED`" test

The reference is the `hides the button for delivered shipments` test in
[`app/src/app/features/shipments/shipment-card/shipment-card.spec.ts`](../../../app/src/app/features/shipments/shipment-card/shipment-card.spec.ts).

Key points:

- a new object through `fixture.componentRef.setInput('shipment', { ...SHIPMENT, status: 'DELIVERED' })`;
- `await fixture.whenStable()` before `expect`, which is why the test is `async`.

## Lesson 4 — the `[innerHTML]` experiment

A broken image is rendered without the `onerror` attribute; `alert` does not fire; the console shows
`WARNING: sanitizing HTML stripped some content`. After the experiment the template must go back to the interpolation `{{ event.description }}`.

## Lessons 3, 5, 7

Oral tasks; model answers are in the *Interview checkpoint* blocks of the corresponding lessons and in
[`docs/en/reference/interview-questions.md`](../../../docs/en/reference/interview-questions.md).

## Lesson 6 — Final challenge

A separate file: [final-challenge.md](final-challenge.md).

## Optional reading

[`app/src/app/features/shipments/shipment-form/shipment-form.spec.ts`](../../../app/src/app/features/shipments/shipment-form/shipment-form.spec.ts) — a Signal Form test (*Optional / Outside 5-hour course*).
