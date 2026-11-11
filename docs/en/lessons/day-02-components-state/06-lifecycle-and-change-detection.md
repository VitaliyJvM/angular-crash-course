# Day 2 · Lesson 6 — Lifecycle, change detection, OnPush and zoneless

**English** | [Українська](../../../uk/lessons/day-02-components-state/06-lifecycle-and-change-detection.md)

**Estimated time:** 10 min · **Time budget:** read 4 · code 3 · try 2 · verify 1

**Learning outcome:** explain when Angular 22 updates the DOM (zoneless + OnPush by default) and name the lifecycle hooks you actually need in signal-based code.

[← Previous: output(): child-to-parent events](05-output-child-to-parent.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Services and inject(): ShipmentStore →](../day-03-services-http/01-services-and-inject.md)

## Why it matters

"Why didn't the UI update?" is the main debugging question in Angular and a standard interview topic. On top of that, in legacy projects you will see different defaults (zone.js, the `Default` strategy), so you need to know both models.

## Concept

**Change detection (CD)** is the process in which Angular compares the values of template bindings with the previous ones and updates the DOM. The only questions are *who triggers it* and *which components are checked*.

| | Legacy (v20 and earlier) | Angular 22 (our project) |
|---|---|---|
| Who triggers CD | **zone.js** patches `setTimeout`, `Promise`, DOM events, XHR and triggers CD after any async operation | **Zoneless** (default since v21, there is no `zone.js` in `package.json`): CD is scheduled only on an explicit notification |
| Which components are checked | `Default` — the whole tree every time | **`OnPush`** (default since v22): only "dirty" components |
| How you wrote optimal code | manually, `changeDetection: ChangeDetectionStrategy.OnPush` | specify nothing; the old behavior is now called `ChangeDetectionStrategy.Eager` (`Default` is a deprecated alias) |

A component becomes dirty (and CD is scheduled) when: a **signal** read in its template has changed; the reference in an **input** has changed; an **event listener** from its template has fired; the `async` pipe has received a value; `markForCheck()` has been called. Assigning to a plain field from `setTimeout`/`subscribe` is **not** on this list.

**Lifecycle** (what is still relevant):

| Moment | API | Note |
|---|---|---|
| Creation | `constructor` / field initializers | this is an **injection context**: `inject()`, `effect()` and `toSignal()` work here. Required inputs are **not available** yet |
| Inputs set for the first time | `ngOnInit` | rarely needed in signal code: a `computed` on an input covers most cases |
| An input changed | `ngOnChanges` | legacy for `@Input()`; with signal inputs it is replaced by `computed`/`effect` |
| DOM rendered | `afterNextRender` | the replacement for `ngAfterViewInit` for working with the DOM / third-party libraries |
| Destruction | `inject(DestroyRef).onDestroy(fn)` / `ngOnDestroy` | unsubscribing, timers |

`effect(() => …)` is a side effect that re-runs when the signals it read change. It is the tool of **last** resort: logging, `localStorage`, imperative APIs; not for synchronizing state.

React mapping: `useEffect(fn, [])` ≈ `ngOnInit`/`afterNextRender`, the cleanup function ≈ `DestroyRef.onDestroy`, `useEffect(fn, [dep])` ≈ `effect()`. Caveat: in React *any* `setState` re-runs the component function and reconciliation of the subtree; in Angular the class is created once, and when a signal changes only the bindings of the templates that read it are checked — so counterparts of `React.memo`/`useCallback` for optimization are usually not needed.

## Follow along

An experiment in `shipment-list/shipment-list.ts`; at the end the code goes back to its lesson 5 state.

1. Temporarily add `effect` to the import from `@angular/core` and insert into the class:

```ts
  protected plainCount = 0; // a plain field, not a signal

  constructor() {
    setTimeout(() => {
      this.plainCount = 99;
      console.log('plainCount is now', this.plainCount);
    }, 2000);

    effect(() => console.log('filter changed to', this.statusFilter()));
  }
```

2. In `shipment-list.html` temporarily add after `<h2>`: `<p>plainCount: {{ plainCount }}</p>`.

3. Open the application with the DevTools Console. The log `filter changed to ALL` is there right away (the effect runs for the first time after creation). After 2 s you get the log `plainCount is now 99`, but **the page still shows `plainCount: 0`**: there is no zone.js, and nobody has notified Angular of the change.

4. Click any filter button → `99` appears on the page. The event listener marked the component dirty, and CD re-read *all* the template bindings, including `plainCount`. In the console there is a new effect log.

5. Conclusion: keep state that affects the template in signals — then updates don't depend on an "accidental" CD run. Remove `plainCount`, the `constructor`, the `effect` import and the line from the template.

## Try it yourself

Predict, then check: how many times is `ShipmentCard` created and destroyed when you switch the filter `ALL` → `DELIVERED` → `ALL`? Add temporary creation (constructor) and destruction logs to `ShipmentCard`. Hints: `inject(DestroyRef).onDestroy(() => …)`; you can't read `this.shipment()` in the constructor yet — log without it or in `ngOnInit`. Notice what happens to the cards that pass both filters. After checking, remove the logs.

## Verify / Expected result

- Step 3: the value in the console (`99`) and on the page (`0`) differ until the first click.
- `practice/package.json` doesn't contain `zone.js`; there is no `changeDetection` in `@Component` — the v22 defaults are at work.
- Try it (on a fresh page load, before you click “Mark delivered”): on `ALL` → `DELIVERED` 3 cards are destroyed and 2 are **not recreated**; on going back to `ALL` 3 new ones are created. This is `track shipment.id` at work.
- At the end `git diff` (if you use git) shows no changes relative to the lesson 5 state; `npx ng build` completes without errors.

## Common mistake / Best practice

**Pitfall:** updating a plain class field in an async callback (`subscribe`, `setTimeout`, `then`) and expecting the template to update. In a zone.js project with the `Default` strategy this worked, so such code is widespread in legacy and breaks after migrating to OnPush/zoneless. **Correct:** template state goes in a `signal` (or an Observable through the `async` pipe / `toSignal`, Day 3). `ChangeDetectorRef.markForCheck()` is a legacy crutch, not a solution for new code.

## Interview checkpoint

**Q: How does change detection work in modern Angular, and what changed compared to zone.js?**

A: Historically zone.js patched async browser APIs and triggered change detection for the whole component tree after any async event. Modern Angular is zoneless by default: change detection is scheduled only when Angular is explicitly notified — a signal read in a template changes, an input changes, a template event fires, the async pipe emits, or `markForCheck` is called. Combined with OnPush, only dirty components are checked.

**Q: What does `OnPush` mean?**

A: With OnPush a component is checked only when it's marked dirty: one of its inputs gets a new reference, an event handler in its template runs, a signal it reads changes, or it's marked manually. Since Angular 22 it's the default; the previous check-always behaviour is called `Eager`. In older codebases you set OnPush explicitly as a performance best practice, which also forces immutable data updates.

## Done when

- [ ] You can name ≥4 triggers that mark a component dirty in zoneless/OnPush.
- [ ] You have seen in the experiment that a plain field set from `setTimeout` doesn't update the template, while a signal does.
- [ ] You can explain why a required input is not available in the constructor and what replaces `ngOnChanges`.
- [ ] The temporary experiment code is removed, and the application builds and works as it did after lesson 5.

---
Docs: [Zoneless](https://angular.dev/guide/zoneless) · [Skipping component subtrees (OnPush)](https://angular.dev/best-practices/skipping-subtrees) · [Component lifecycle](https://angular.dev/guide/components/lifecycle)

[← Previous: output(): child-to-parent events](05-output-child-to-parent.md) · [Next: Services and inject(): ShipmentStore →](../day-03-services-http/01-services-and-inject.md)
