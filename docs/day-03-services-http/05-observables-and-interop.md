# Day 3 · Lesson 5 — Observable basics і безпечні subscriptions: пошук із debounce

**Estimated time:** 15 хв · **Time budget:** read 5 · code 6 · try 2 · verify 2
**Learning outcome:** пояснити, що таке Observable і коли subscription стає memory leak, та додати пошук із debounce через `toObservable` → RxJS operators → `toSignal`.

[← Попередній: Loading / error / empty states](04-loading-error-empty-states.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Signals vs RxJS: що коли обирати →](06-signals-vs-rxjs.md)

## Why it matters

`HttpClient`, Router events, Reactive Forms (`valueChanges`) — усе це Observables, і в enterprise-коді їх багато. Найчастіший реальний баг Angular-проєктів — забута subscription. Питання про неї є майже на кожній співбесіді.

## Concept

**Observable** — джерело від 0 до ∞ значень у часі, яке можна скасувати.

| | Promise | Observable |
|---|---|---|
| Старт | одразу (eager) | після `subscribe()` (lazy) |
| Значень | одне | 0…∞ |
| Скасування | немає (окремо `AbortController`) | `unsubscribe()` |
| Композиція | `then` / `await` | operators у `pipe()` |

**Коли subscription — leak?** Коли потік не завершується сам, а ти не відписався.

- `http.get()` — cold Observable: одне значення → `complete`. Тому `subscribe()` у `ShipmentStore.load()` **безпечний**: після відповіді subscription зникає сама.
- `interval()`, `valueChanges`, Router events, WebSocket, `toObservable(signal)` — **нескінченні**. Голий `subscribe()` у компоненті житиме після його знищення.

Безпечні способи для довгих потоків (жоден не вимагає ручного `unsubscribe`):

```ts
readonly value = toSignal(stream$, { initialValue: '' });   // 1. перетворити на signal
// 2. template: {{ stream$ | async }}                       — AsyncPipe відписується сам
stream$.pipe(takeUntilDestroyed()).subscribe(...);          // 3. коли справді потрібен side effect
```

**Interop** (`@angular/core/rxjs-interop`): `toObservable(signal)` — signal → Observable; `toSignal(observable)` — навпаки, з автоматичною відпискою при знищенні компонента. Обидва працюють лише в injection context.

**Навіщо RxJS для пошуку?** Signal знає поточне значення, але не знає про **час**. «Зачекай 300 мс після останнього натискання» — операція над потоком подій, це робота operator `debounceTime`. `distinctUntilChanged` відкидає повтор того самого значення. (Для пошуку через HTTP сюди додають `switchMap` для скасування попереднього запиту та `catchError` — поза межами курсу.)

React-паралель: `useEffect(() => { const t = setTimeout(...); return () => clearTimeout(t); }, [term])`. Cleanup function там — те саме, що відписка тут; `toSignal` робить її за тебе.

## Follow along

1. У `src/app/features/shipments/shipment-list/shipment-list.ts` додай імпорти:

   ```ts
   import { toObservable, toSignal } from '@angular/core/rxjs-interop';
   import { debounceTime, distinctUntilChanged } from 'rxjs';
   ```

2. У клас, після `statusFilter`, додай стан пошуку:

   ```ts
   // Signal -> Observable (time-based operators) -> Signal. toSignal unsubscribes on destroy.
   protected readonly searchTerm = signal('');
   private readonly debouncedSearchTerm = toSignal(
     toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
     { initialValue: '' },
   );
   ```

   `initialValue` потрібен, бо debounced-потік нічого не видає перші 300 мс, а signal завжди мусить мати значення.

3. Заміни `filteredShipments`, щоб він враховував і фільтр, і пошук:

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

   `computed` читає три signals і перераховується при зміні будь-якого — жодних dependency arrays.

4. У `shipment-list.html` між блоком `.filters` і `<ul class="shipments">` додай поле:

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

   `#searchInput` — template reference variable: типізоване посилання на DOM-елемент, без `$event.target` і приведення типів. `<label>`, що огортає `<input>`, дає доступну назву поля.

5. Допиши в кінець `shipment-list.css`:

   ```css
   .search {
     display: grid;
     gap: 4px;
     margin-bottom: 12px;
     max-width: 320px;
   }
   ```

6. Щоб побачити debounce, тимчасово постав `debounceTime(1500)`, швидко набери `1004` — список оновиться один раз, через 1.5 с після останньої клавіші. Поверни `300`.

## Try it yourself

Зараз `PF-1001` і `PF-1001␣` (з пробілом у кінці) — різні значення для `distinctUntilChanged`, хоча результат фільтрації однаковий. Зміни pipeline так, щоб значення нормалізувалося (`trim`) **до** порівняння. Після перевірки можеш залишити або повернути як було — на наступні уроки це не впливає (еталонний `app/` цього не містить).

Hint: потрібен ще один operator з `rxjs`; порядок operators у `pipe()` має значення.

## Verify / Expected result

- Введи `100` — лишаються 5 посилок; `1003` — одна; `zzz` — `No shipments match the current filters.`
- Пошук комбінується з фільтром статусу: `DELIVERED` + `100` → дві посилки (PF-1002, PF-1005).
- Список оновлюється із затримкою ≈ 300 мс після останнього натискання, а не на кожну клавішу.
- У коді `ShipmentList` немає жодного `.subscribe(`; `npx ng build` проходить.

## Common mistake / Best practice

**Пастка:** у компоненті написати `toObservable(this.searchTerm).pipe(debounceTime(300)).subscribe((v) => this.term = v)` (або так само підписатися на `valueChanges` чи Router events). Потік нескінченний: без відписки callback працює й після знищення компонента — leak і «примарні» оновлення; до того ж запис у звичайне поле не оновить view в zoneless/OnPush.
**Правильно:** `toSignal(...)` або `async` pipe; якщо потрібен саме side effect — `pipe(takeUntilDestroyed())`. Голий `subscribe()` припустимий лише для потоків, що гарантовано завершуються (HTTP), і бажано в service, а не в компоненті.

## Interview checkpoint

**Q: What is the difference between an Observable and a Promise?**
A: A Promise is eager and resolves once with a single value. An Observable is lazy — nothing happens until you subscribe — can emit many values over time, can be cancelled by unsubscribing, and is composed with operators like `map`, `debounceTime` or `switchMap`.

**Q: How do you avoid memory leaks with subscriptions?**
A: I avoid manual subscriptions where I can: `toSignal` or the `async` pipe subscribe and unsubscribe automatically. If I need a side effect, I use `takeUntilDestroyed()`. HTTP observables complete after one response, so they are safe; long-lived streams like form `valueChanges`, router events or intervals must always be cleaned up.

## Done when

- [ ] Поле пошуку фільтрує список із debounce 300 мс і комбінується з фільтром статусу.
- [ ] `debouncedSearchTerm` створено через `toObservable` → `pipe` → `toSignal` з `initialValue`.
- [ ] У `ShipmentList` немає ручних subscriptions.
- [ ] Можеш пояснити, чому `subscribe()` у `ShipmentStore.load()` не є leak, а на `valueChanges` — був би.

---
Docs: [RxJS interop: toSignal / toObservable](https://angular.dev/ecosystem/rxjs-interop) · [takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed) · [AsyncPipe](https://angular.dev/api/common/AsyncPipe)
[← Попередній: Loading / error / empty states](04-loading-error-empty-states.md) · [Наступний: Signals vs RxJS: що коли обирати →](06-signals-vs-rxjs.md)
