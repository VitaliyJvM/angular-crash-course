# Day 3 · Lesson 6 — Signals vs RxJS: when to use which

**English** | [Українська](../../../uk/lessons/day-03-services-http/06-signals-vs-rxjs.md)

**Estimated time:** 5 min · **Time budget:** read 2.5 · code 1.5 · try 0.5 · verify 0.5

**Learning outcome:** make a reasoned choice between Signals and RxJS for a specific task and explain what `httpResource` is.

[← Previous: Observable basics and safe subscriptions: debounced search](05-observables-and-interop.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Routes and navigation →](../day-04-routing-forms/01-routes-and-navigation.md)

## Why it matters

Modern Angular code mixes both mechanisms: new features are written with Signals, while HTTP, the Router and legacy code stay on RxJS. "Signals vs RxJS" is one of the most common interview questions of 2025–2026.

## Concept

Signals are **state** (a value that is always there). RxJS is **events over time** (a stream that can be transformed and cancelled). They complement each other.

| Task | Tool |
|---|---|
| Component / store state, derived values | `signal`, `computed` |
| Reading in the template, change detection | signals (the view updates by itself) |
| Debounce, throttle, retry, timeout | RxJS operators |
| Request cancellation, race conditions | RxJS (`switchMap`) |
| WebSocket, Router events, combining streams | RxJS |
| A simple GET that depends on a parameter | `httpResource` |
| The bridge between the two worlds | `toSignal()` / `toObservable()` |

| | Signal | Observable |
|---|---|---|
| Current value | always there, read synchronously with `x()` | none (except `BehaviorSubject`) |
| Subscription | automatic (template, `computed`, `effect`) | explicit, needs cleanup |
| Time / async | does not model it | its main purpose |

React parallel: `signal` ≈ `useState`, `computed` ≈ `useMemo` without a dependency array, `effect` ≈ `useEffect`. Caveat: React re-runs the component function and diffs the virtual DOM, whereas a signal notifies only its own consumers, precisely. React core has no direct analogue of RxJS — there it is `useEffect` + cleanup or TanStack Query.

**`httpResource`** (stable in Angular 22) is a signal-based GET: `httpResource<Shipment[]>(() => 'data/shipments.json')` returns an object with the signals `value()`, `hasValue()`, `isLoading()`, `error()` and the method `reload()`. If the URL function reads a signal, the request is repeated when it changes. It is for reading data only; mutations (POST/PUT) still go through `HttpClient`. In the course we keep the store because we need the in-memory `markDelivered` / `add` on top of the loaded list.

## Follow along

1. Temporarily add to the `ShipmentList` class (imports: `httpResource` from `@angular/common/http`, `Shipment` from `../shipment.model`):

   ```ts
   protected readonly demo = httpResource<Shipment[]>(() => 'data/shipments.json');
   ```

   and under the `<h2>` in `shipment-list.html`:

   ```html
   <p class="muted">
     httpResource:
     @if (demo.isLoading()) { loading… } @else if (demo.hasValue()) { {{ demo.value().length }} shipments }
     @else if (demo.error()) { failed }
     <button type="button" (click)="demo.reload()">Reload</button>
   </p>
   ```

2. The browser shows `httpResource: 5 shipments`; Reload triggers a new GET in Network. Note: no `subscribe`, no `loading` flag, no store — that is everything you wrote by hand in Lessons 3–4.
3. Remove `demo`, both imports and the `<p>` block — the code is back to its state after Lesson 5.

## Try it yourself

Without looking at the table, for each item choose Signals, RxJS or both and give the reason in one sentence: (a) a counter of shipments by status; (b) autocomplete that queries the server as you type; (c) a real-time shipment status over WebSocket that is shown in the template. The answers are in `exercises/solutions/en/day-03.md`.

## Verify / Expected result

- After step 3 the application looks as it did at the end of Lesson 5, and `npx ng build` passes.
- `shipment-list.ts` contains no `httpResource`.

## Common mistake / Best practice

**Pitfall:** reading `resource.value()` without a check — in the error state it throws an exception at runtime and breaks rendering. **Do this instead:** check `hasValue()` first (it also narrows the type), as in the example.
General rule: do not rewrite working RxJS streams to signals "because it is trendy", and do not implement debounce with `effect` + `setTimeout` — pick the tool that fits the task and connect them through `toSignal` / `toObservable`.

## Interview checkpoint

**Q: When would you use Signals and when RxJS?**

A: Signals for synchronous state and derived values that the template reads — they always have a current value and need no subscription management. RxJS for asynchronous event streams: debouncing, cancellation, retries, websockets, combining sources. They interoperate through `toSignal` and `toObservable`, so a typical pattern is RxJS at the edges and signals for the state the UI renders.

**Q: What is `httpResource`?**

A: A signal-based wrapper around HttpClient for fetching data. You give it a reactive function that returns a URL or request; it exposes the value, loading and error state as signals and refetches when the signals it reads change. It is meant for reads — mutations still go through HttpClient.

## Done when

- [ ] You can explain aloud, in 30 seconds, when to use Signals and when RxJS.
- [ ] You can name the signals that `httpResource` exposes and why the course chose a store.
- [ ] The temporary `demo` is removed; Day 3 is complete — mark it in `PROGRESS.md`.

---
Docs: [Signals overview](https://angular.dev/guide/signals) · [httpResource](https://angular.dev/guide/http/http-resource) · [RxJS interop](https://angular.dev/ecosystem/rxjs-interop)

[← Previous: Observable basics and safe subscriptions: debounced search](05-observables-and-interop.md) · [Next: Routes and navigation →](../day-04-routing-forms/01-routes-and-navigation.md)
