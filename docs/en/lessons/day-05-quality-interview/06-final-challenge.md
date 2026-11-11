# Day 5 · Lesson 6 — Final challenge: deleting a shipment

**English** | [Українська](../../../uk/lessons/day-05-quality-interview/06-final-challenge.md)

**Estimated time:** 15 min · **Time budget:** read 2 · code 10 · verify 3

**Learning outcome:** on your own, without step-by-step instructions, carry a new feature through every layer: store → presentational component → page component → unit test.

[← Previous: Angular vs React: decision guide](05-angular-vs-react-decision-guide.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Interview review →](07-interview-review.md)

## Why it matters

A typical work task and a typical live-coding assignment: "add an action to a list item". It checks your understanding of data flow (inputs down, events up), immutable updates in signals and the ability not to break existing tests.

## Concept

There is no new theory. The task uses only what is already in the project:

- a state operation in `ShipmentStore` modeled on `markDelivered` (Day 3);
- an `output()` in `ShipmentCard` modeled on `delivered` (Day 2);
- handling the event in `ShipmentList` (Day 2–3);
- a store test with `HttpTestingController` (Lesson 1).

Deleting, like adding, happens **only in memory**: there is no backend, and after a page refresh the list goes back to the contents of `shipments.json`.

## Follow along

This is not a step-by-step solution but the requirements and a recommended order.

**Required:**

1. **Store.** `ShipmentStore.remove(id: number): void` — removes the shipment from the list. An unknown `id` changes nothing and does not throw an error.
2. **Card → List.** `ShipmentCard` gets a **Delete** button and a new `removed = output<number>()`. The card itself deletes nothing. `ShipmentList` handles the event by calling `store.remove($event)`. The `Total / In transit / Delivered` counters update without any extra code.
3. **Test.** One unit test for `remove` in `shipment-store.spec.ts`.

**Recommended order:** store → store test (red/green) → card → list → full test run → check in the browser.

**Stretch (Optional / Outside 5-hour course):** a carrier filter — a `<select>` in `ShipmentList` (options from `CARRIERS` + "all") that combines with the status filter and the search **inside the existing** `computed` `filteredShipments`. It has a `<label>`.

## Try it yourself

Complete the Required part in your `practice/` in 10 minutes without opening `exercises/solutions/en/final-challenge.md`.

Hints:

- After you add a second button to the card, one of the `shipment-card.spec.ts` tests may fail. This is expected: decide what exactly that test was meant to guarantee, and fix the **test**, not the markup for the sake of the test.
- If the counters did not update after a deletion, check whether `remove` returns a new array.

## Verify / Expected result

```bash
npx ng test --no-watch
npx ng build
```

- All tests are green, including the new `remove` test; the build has no errors.
- In the browser: **Delete** on a card removes it from the list, and `Total` decreases by 1; deleting an `IN_TRANSIT` shipment decreases `In transit` as well.
- After a deletion, navigating to the direct URL of the deleted shipment (`/shipments/<id>`) shows `Shipment #<id> not found.` — with no changes in `ShipmentDetails`.
- The **Delete** button is reachable with `Tab` and fires on `Enter`.
- Refreshing the page brings back the initial 5 shipments (in-memory, this is expected).
- Self-review: there is no `inject(ShipmentStore)` in `ShipmentCard`; there is no `splice`/`push` in `remove`.

After your own attempt, compare with [exercises/solutions/final-challenge.md](../../../../exercises/solutions/en/final-challenge.md).

## Common mistake / Best practice

**Pitfall:** injecting `ShipmentStore` straight into `ShipmentCard` and calling `store.remove()` from the card — "it's shorter that way". Consequence: the presentational component gets a hidden dependency, it cannot be reused (for example, in an archive list where Delete means something else), and the test now needs a mock store and HTTP. **Correct:** the card only emits `removed`, and the page component makes the decision — just like with `delivered`.

## Interview checkpoint

**Q: Walk me through how you would add a "delete item" feature in an Angular app.**

A: I add a `remove` method to the state service that updates the signal immutably, cover it with a unit test, then add an output to the presentational item component and handle it in the page component by calling the service. Derived values like counters are `computed`, so they update automatically. With a real backend the service would call the API and update state on success, or optimistically with rollback on error.

**Q: Why should the card emit an event instead of calling the service itself?**

A: It keeps the component presentational: it depends only on its inputs and outputs, so it is reusable and trivial to test. The parent decides what the event means.

## Done when

- [ ] `ShipmentStore.remove(id)` is implemented with an immutable update.
- [ ] `ShipmentCard` has a Delete button and `removed = output<number>()`; `ShipmentList` calls `store.remove($event)`.
- [ ] `shipment-store.spec.ts` has a test for `remove`, and it is green.
- [ ] `npx ng test --no-watch` and `npx ng build` pass without errors.
- [ ] (Optional) the carrier filter works together with the status filter and the search.

---

Docs: [Outputs](https://angular.dev/guide/components/outputs) · [Signals](https://angular.dev/guide/signals) · [Testing services](https://angular.dev/guide/testing/services)

[← Previous: Angular vs React: decision guide](05-angular-vs-react-decision-guide.md) · [Next: Interview review →](07-interview-review.md)
