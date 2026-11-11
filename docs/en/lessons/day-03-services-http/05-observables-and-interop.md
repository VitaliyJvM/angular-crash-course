# Day 3 · Lesson 5 — Observable basics and safe subscriptions: debounced search

**English** | [Українська](../../../uk/lessons/day-03-services-http/05-observables-and-interop.md)

**Estimated time:** 15 min · **Time budget:** read 5 · code 6 · try 2 · verify 2

**Learning outcome:** explain what an Observable is and when a subscription becomes a memory leak, and add a debounced search via `toObservable` → RxJS operators → `toSignal`.

[← Previous: Loading / error / empty states](04-loading-error-empty-states.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Signals vs RxJS: when to use which →](06-signals-vs-rxjs.md)

## Why it matters

`HttpClient`, Router events, Reactive Forms (`valueChanges`) — all of these are Observables, and enterprise code has a lot of them. The most common real-world bug in Angular projects is a forgotten subscription. A question about it comes up in almost every interview.

## Concept

An **Observable** is a source of 0 to ∞ values over time that can be cancelled.

| | Promise | Observable |
|---|---|---|
| Start | immediately (eager) | after `subscribe()` (lazy) |
| Values | one | 0…∞ |
| Cancellation | none (separately, `AbortController`) | `unsubscribe()` |
| Composition | `then` / `await` | operators in `pipe()` |

**When is a subscription a leak?** When the stream does not complete on its own and you have not unsubscribed.

- `http.get()` is a cold Observable: one value → `complete`. That is why `subscribe()` in `ShipmentStore.load()` is **safe**: after the response the subscription goes away by itself.
- `interval()`, `valueChanges`, Router events, WebSocket are **infinite**. A bare `subscribe()` in a component will outlive its destruction. (`toObservable(signal)` is long-lived too, but it completes when its injector is destroyed.)

Safe options for long-lived streams (none of them requires a manual `unsubscribe`):

```ts
readonly value = toSignal(stream$, { initialValue: '' });   // 1. convert to a signal
// 2. template: {{ stream$ | async }}                       — AsyncPipe unsubscribes by itself
stream$.pipe(takeUntilDestroyed()).subscribe(...);          // 3. when you really need a side effect
```

**Interop** (`@angular/core/rxjs-interop`): `toObservable(signal)` — signal → Observable; `toSignal(observable)` — the other way round, with automatic unsubscription when the component is destroyed. Both work only in an injection context.

**Why RxJS for search?** A signal knows the current value but knows nothing about **time**. "Wait 300 ms after the last keystroke" is an operation on a stream of events, and that is the job of the `debounceTime` operator. `distinctUntilChanged` drops a repeat of the same value. (For search over HTTP you would add `switchMap` to cancel the previous request and `catchError` — outside the scope of this course.)

React parallel: `useEffect(() => { const t = setTimeout(...); return () => clearTimeout(t); }, [term])`. The cleanup function there is the same thing as unsubscribing here; `toSignal` does it for you.

## Follow along

1. In `src/app/features/shipments/shipment-list/shipment-list.ts` add the imports:

   ```ts
   import { toObservable, toSignal } from '@angular/core/rxjs-interop';
   import { debounceTime, distinctUntilChanged } from 'rxjs';
   ```

2. In the class, after `statusFilter`, add the search state:

   ```ts
   // Signal -> Observable (time-based operators) -> Signal. toSignal unsubscribes on destroy.
   protected readonly searchTerm = signal('');
   private readonly debouncedSearchTerm = toSignal(
     toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
     { initialValue: '' },
   );
   ```

   `initialValue` is needed because `toObservable()` emits through an effect, not synchronously: the stream has no value at the moment `toSignal` is created (and `debounceTime` delays the first one by another 300 ms), while a signal must always have a value. Without `initialValue` the signal would be typed `string | undefined`.

3. Replace `filteredShipments` so that it takes both the filter and the search into account:

   ```ts
   protected readonly filteredShipments = computed(() => {
     const filter = this.statusFilter();
     const term = this.debouncedSearchTerm().trim().toLowerCase();
     return this.store
       .shipments()
       .filter((s) => filter === 'ALL' || s.status === filter)
       .filter((s) => s.trackingNumber.toLowerCase().includes(term));
   });
   ```

   `computed` reads three signals and recomputes when any of them changes — no dependency arrays.

4. In `shipment-list.html`, between the `.filters` block and `<ul class="shipments">`, add the field:

   ```html
   <label class="search">
     Search by tracking number
     <input
       #searchInput
       type="search"
       placeholder="PF-1001"
       [value]="searchTerm()"
       (input)="searchTerm.set(searchInput.value)"
     />
   </label>
   ```

   `#searchInput` is a template reference variable: a typed reference to the DOM element, without `$event.target` and type casts. The `<label>` wrapping the `<input>` gives the field an accessible name.

5. Append to the end of `shipment-list.css`:

   ```css
   .search {
     display: grid;
     gap: 4px;
     margin-bottom: 12px;
     max-width: 320px;
   }
   ```

6. To see the debounce, temporarily set `debounceTime(1500)` and quickly type `1004` — the list updates once, 1.5 s after the last key. Change it back to `300`.

## Try it yourself

Right now `PF-1001` and `PF-1001␣` (with a trailing space) are different values for `distinctUntilChanged`, even though the filtering result is the same. Change the pipeline so that the value is normalized (`trim`) **before** the comparison. Once you have checked it, you can keep it or revert it — it does not affect the following lessons (the reference `app/` does not contain it).

Hint: you need one more operator from `rxjs`; the order of the operators in `pipe()` matters.

## Verify / Expected result

- Type `100` — 5 shipments remain; `1003` — one; `zzz` — `No shipments match the current filters.`
- The search combines with the status filter: `DELIVERED` + `100` → two shipments (PF-1002, PF-1005).
- The list updates with a delay of ≈ 300 ms after the last keystroke, not on every key.
- The `ShipmentList` code contains no `.subscribe(`; `npx ng build` passes.

## Common mistake / Best practice

**Pitfall:** writing `inject(Router).events.subscribe((e) => this.lastEvent = e)` in a component (or subscribing to `valueChanges`, `interval()` or a WebSocket in the same way). The stream is infinite: without unsubscribing, the callback keeps running after the component is destroyed — a leak and "ghost" updates; on top of that, writing to a plain field will not update the view in zoneless/OnPush.

**Do this instead:** `toSignal(...)` or the `async` pipe; if you specifically need a side effect — `pipe(takeUntilDestroyed())`. A bare `subscribe()` is acceptable only for streams that are guaranteed to complete (HTTP), and preferably in a service rather than in a component.

## Interview checkpoint

**Q: What is the difference between an Observable and a Promise?**

A: A Promise is eager and resolves once with a single value. An Observable is lazy — nothing happens until you subscribe — can emit many values over time, can be cancelled by unsubscribing, and is composed with operators like `map`, `debounceTime` or `switchMap`.

**Q: How do you avoid memory leaks with subscriptions?**

A: I avoid manual subscriptions where I can: `toSignal` or the `async` pipe subscribe and unsubscribe automatically. If I need a side effect, I use `takeUntilDestroyed()`. HTTP observables complete after one response, so they are safe; long-lived streams like form `valueChanges`, router events or intervals must always be cleaned up.

## Done when

- [ ] The search field filters the list with a 300 ms debounce and combines with the status filter.
- [ ] `debouncedSearchTerm` is created via `toObservable` → `pipe` → `toSignal` with `initialValue`.
- [ ] `ShipmentList` has no manual subscriptions.
- [ ] You can explain why `subscribe()` in `ShipmentStore.load()` is not a leak, while on `valueChanges` it would be.

---
Docs: [RxJS interop: toSignal / toObservable](https://angular.dev/ecosystem/rxjs-interop) · [takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed) · [AsyncPipe](https://angular.dev/api/common/AsyncPipe)

[← Previous: Loading / error / empty states](04-loading-error-empty-states.md) · [Next: Signals vs RxJS: when to use which →](06-signals-vs-rxjs.md)
