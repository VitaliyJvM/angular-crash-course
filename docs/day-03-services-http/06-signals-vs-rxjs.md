# Day 3 · Lesson 6 — Signals vs RxJS: що коли обирати

**Estimated time:** 5 хв · **Time budget:** read 2.5 · code 1.5 · try 0.5 · verify 0.5
**Learning outcome:** аргументовано обрати Signals або RxJS для конкретної задачі та пояснити, що таке `httpResource`.

[← Попередній: Observable basics і безпечні subscriptions: пошук із debounce](05-observables-and-interop.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Routes та навігація →](../day-04-routing-forms/01-routes-and-navigation.md)

## Why it matters

Сучасний Angular-код змішує обидва механізми: нові фічі пишуть на Signals, а HTTP, Router і legacy-код лишаються на RxJS. «Signals vs RxJS» — одне з найчастіших питань на співбесідах 2025–2026.

## Concept

Signals — це **стан** (значення, яке є завжди). RxJS — це **події в часі** (потік, який можна трансформувати й скасувати). Вони доповнюють одне одного.

| Задача | Інструмент |
|---|---|
| Стан компонента / store, похідні значення | `signal`, `computed` |
| Читання в template, change detection | signals (view оновлюється сам) |
| Debounce, throttle, retry, timeout | RxJS operators |
| Скасування запитів, race conditions | RxJS (`switchMap`) |
| WebSocket, Router events, комбінування потоків | RxJS |
| Простий GET, залежний від параметра | `httpResource` |
| Міст між світами | `toSignal()` / `toObservable()` |

| | Signal | Observable |
|---|---|---|
| Поточне значення | завжди є, читається синхронно `x()` | немає (крім `BehaviorSubject`) |
| Підписка | автоматична (template, `computed`, `effect`) | явна, потребує cleanup |
| Час / async | не моделює | основне призначення |

React-паралель: `signal` ≈ `useState`, `computed` ≈ `useMemo` без dependency array, `effect` ≈ `useEffect`. Застереження: React перезапускає функцію компонента й порівнює virtual DOM, а signal точково сповіщає лише своїх споживачів. Прямого аналога RxJS у React core немає — там це `useEffect` + cleanup або TanStack Query.

**`httpResource`** (stable в Angular 22) — signal-based GET: `httpResource<Shipment[]>(() => 'data/shipments.json')` повертає об'єкт із signals `value()`, `hasValue()`, `isLoading()`, `error()` і методом `reload()`. Якщо URL-функція читає signal — запит повторюється при його зміні. Тільки для читання даних; мутації (POST/PUT) як і раніше через `HttpClient`. У курсі ми лишаємо store, бо потрібні in-memory `markDelivered` / `add` поверх завантаженого списку.

## Follow along

1. Тимчасово додай у клас `ShipmentList` (імпорти: `httpResource` з `@angular/common/http`, `Shipment` з `../shipment.model`):

   ```ts
   protected readonly demo = httpResource<Shipment[]>(() => 'data/shipments.json');
   ```

   і під `<h2>` у `shipment-list.html`:

   ```html
   <p class="muted">
     httpResource:
     @if (demo.isLoading()) { loading… } @else if (demo.hasValue()) { {{ demo.value().length }} shipments }
     @else if (demo.error()) { failed }
     <button type="button" (click)="demo.reload()">Reload</button>
   </p>
   ```

2. У браузері видно `httpResource: 5 shipments`; Reload запускає новий GET у Network. Зауваж: жодного `subscribe`, `loading`-прапорця чи store — це все, що ти написав(-ла) вручну в Lesson 3–4.
3. Видали `demo`, обидва імпорти та блок `<p>` — код повертається до стану після Lesson 5.

## Try it yourself

Не дивлячись у таблицю, для кожного пункту обери Signals, RxJS або обидва й назви причину одним реченням: (a) лічильник посилок за статусом; (b) autocomplete із запитом на сервер під час набору; (c) статус посилки в реальному часі через WebSocket, який показується в template. Відповіді — в `exercises/solutions/day-03.md`.

## Verify / Expected result

- Після кроку 3 застосунок виглядає як наприкінці Lesson 5, `npx ng build` проходить.
- У `shipment-list.ts` немає `httpResource`.

## Common mistake / Best practice

**Пастка:** читати `resource.value()` без перевірки — у стані помилки це кидає exception у runtime і ламає рендер. **Правильно:** спершу `hasValue()` (він же звужує тип), як у прикладі.
Загальне правило: не переписуй робочі RxJS-потоки на signals «бо модно» і не роби debounce через `effect` + `setTimeout` — бери інструмент за задачею й з'єднуй їх через `toSignal` / `toObservable`.

## Interview checkpoint

**Q: When would you use Signals and when RxJS?**
A: Signals for synchronous state and derived values that the template reads — they always have a current value and need no subscription management. RxJS for asynchronous event streams: debouncing, cancellation, retries, websockets, combining sources. They interoperate through `toSignal` and `toObservable`, so a typical pattern is RxJS at the edges and signals for the state the UI renders.

**Q: What is `httpResource`?**
A: A signal-based wrapper around HttpClient for fetching data. You give it a reactive function that returns a URL or request; it exposes the value, loading and error state as signals and refetches when the signals it reads change. It is meant for reads — mutations still go through HttpClient.

## Done when

- [ ] Можеш за 30 секунд пояснити англійською, коли Signals, а коли RxJS.
- [ ] Можеш назвати signals, які надає `httpResource`, і чому в курсі обрано store.
- [ ] Тимчасовий `demo` видалено; Day 3 завершено — познач у `PROGRESS.md`.

---
Docs: [Signals overview](https://angular.dev/guide/signals) · [httpResource](https://angular.dev/guide/http/http-resource) · [RxJS interop](https://angular.dev/ecosystem/rxjs-interop)
[← Попередній: Observable basics і безпечні subscriptions: пошук із debounce](05-observables-and-interop.md) · [Наступний: Routes та навігація →](../day-04-routing-forms/01-routes-and-navigation.md)
