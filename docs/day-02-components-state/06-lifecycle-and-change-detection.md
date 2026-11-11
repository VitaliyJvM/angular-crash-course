# Day 2 · Lesson 6 — Lifecycle, change detection, OnPush і zoneless

**Estimated time:** 10 хв · **Time budget:** read 4 · code 3 · try 2 · verify 1
**Learning outcome:** пояснити, коли Angular 22 оновлює DOM (zoneless + OnPush за замовчуванням), і назвати lifecycle hooks, які реально потрібні в signal-based коді.

[← Попередній: output(): подія від child до parent](05-output-child-to-parent.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Services та inject() →](../day-03-services-http/01-services-and-inject.md)

## Why it matters

«Чому UI не оновився?» — головне debugging-питання в Angular і обов'язкова тема співбесід. До того ж у legacy-проєктах ти побачиш інші defaults (zone.js, `Default` strategy), тож треба знати обидві моделі.

## Concept

**Change detection (CD)** — процес, у якому Angular порівнює значення bindings у шаблоні з попередніми й оновлює DOM. Питання лише в тому, *хто його запускає* і *які компоненти перевіряються*.

| | Legacy (до v20) | Angular 22 (наш проєкт) |
|---|---|---|
| Хто запускає CD | **zone.js** патчить `setTimeout`, `Promise`, DOM events, XHR і запускає CD після будь-якої async-операції | **Zoneless** (default з v21, `zone.js` немає в `package.json`): CD планується лише за явним сигналом |
| Які компоненти перевіряються | `Default` — усе дерево щоразу | **`OnPush`** (default з v22): лише «dirty»-компоненти |
| Як писали оптимальний код | вручну `changeDetection: ChangeDetectionStrategy.OnPush` | нічого не вказувати; стара поведінка тепер зветься `ChangeDetectionStrategy.Eager` (`Default` — deprecated alias) |

Компонент стає dirty (і CD планується), коли: змінився **signal**, прочитаний у його шаблоні; змінилося посилання в **input**; спрацював **event listener** із його шаблону; `async` pipe отримав значення; викликано `markForCheck()`. Присвоєння у звичайне поле з `setTimeout`/`subscribe` — **не** в цьому списку.

**Lifecycle** (що лишилось актуальним):

| Момент | API | Примітка |
|---|---|---|
| Створення | `constructor` / field initializers | це **injection context**: тут працюють `inject()`, `effect()`, `toSignal()`. Required inputs ще **не доступні** |
| Inputs встановлено вперше | `ngOnInit` | у signal-коді потрібен рідко: `computed` на input покриває більшість випадків |
| Input змінився | `ngOnChanges` | legacy для `@Input()`; із signal inputs замінюється на `computed`/`effect` |
| DOM відрендерено | `afterNextRender` | заміна `ngAfterViewInit` для роботи з DOM / сторонніми бібліотеками |
| Знищення | `inject(DestroyRef).onDestroy(fn)` / `ngOnDestroy` | відписки, таймери |

`effect(() => …)` — side effect, що перевиконується при зміні прочитаних сигналів. Це **останній** інструмент: логування, `localStorage`, imperative API; не для синхронізації стану.

React mapping: `useEffect(fn, [])` ≈ `ngOnInit`/`afterNextRender`, cleanup-функція ≈ `DestroyRef.onDestroy`, `useEffect(fn, [dep])` ≈ `effect()`. Застереження: у React *будь-який* `setState` перезапускає функцію компонента й reconciliation піддерева; в Angular клас створюється один раз, а при зміні сигналу перевіряються лише bindings шаблонів, які його читають, — тому аналогів `React.memo`/`useCallback` для оптимізації зазвичай не потрібно.

## Follow along

Експеримент у `shipment-list/shipment-list.ts`; наприкінці код повертається до стану уроку 5.

1. Тимчасово додай `effect` до імпорту з `@angular/core` і встав у клас:

```ts
  protected plainCount = 0; // звичайне поле, не signal

  constructor() {
    setTimeout(() => {
      this.plainCount = 99;
      console.log('plainCount is now', this.plainCount);
    }, 2000);

    effect(() => console.log('filter changed to', this.statusFilter()));
  }
```

2. У `shipment-list.html` тимчасово додай після `<h2>`: `<p>plainCount: {{ plainCount }}</p>`.

3. Відкрий застосунок із DevTools Console. Одразу є лог `filter changed to ALL` (effect виконується перший раз після створення). Через 2 с — лог `plainCount is now 99`, але **на сторінці досі `plainCount: 0`**: zone.js немає, ніхто не повідомив Angular про зміну.

4. Натисни будь-яку кнопку фільтра → на сторінці з'являється `99`. Event listener позначив компонент dirty, CD перечитав *усі* bindings шаблону, зокрема й `plainCount`. У консолі — новий лог effect.

5. Висновок: стан, який впливає на шаблон, тримай у signals — тоді оновлення не залежить від «випадкового» CD. Видали `plainCount`, `constructor`, імпорт `effect` і рядок із шаблону.

## Try it yourself

Передбач, а потім перевір: скільки разів створюється і знищується `ShipmentCard`, коли ти перемикаєш фільтр `ALL` → `DELIVERED` → `ALL`? Додай у `ShipmentCard` тимчасові логи створення (constructor) і знищення. Hints: `inject(DestroyRef).onDestroy(() => …)`; у constructor `this.shipment()` ще не можна читати — логуй без нього або в `ngOnInit`. Зверни увагу, що відбувається з картками, які проходять обидва фільтри. Після перевірки видали логи.

## Verify / Expected result

- Крок 3: значення в консолі (`99`) і на сторінці (`0`) розходяться до першого кліку.
- `practice/package.json` не містить `zone.js`; у `@Component` жодного `changeDetection` — працюють defaults v22.
- Try it: при `ALL` → `DELIVERED` знищуються 3 картки, 2 **не перестворюються**; при поверненні до `ALL` створюються 3 нові. Це робота `track shipment.id`.
- Наприкінці `git diff` (якщо ведеш git) не показує змін відносно стану уроку 5; `npx ng build` проходить без помилок.

## Common mistake / Best practice

**Пастка:** оновлювати звичайне поле класу в async-callback (`subscribe`, `setTimeout`, `then`) і чекати, що шаблон оновиться. У zone.js-проєкті з `Default` strategy це працювало, тому такий код масово трапляється в legacy й ламається після міграції на OnPush/zoneless. **Правильно:** стан шаблону — у `signal` (або Observable через `async` pipe / `toSignal`, Day 3). `ChangeDetectorRef.markForCheck()` — legacy-милиця, а не рішення для нового коду.

## Interview checkpoint

**Q: How does change detection work in modern Angular, and what changed compared to zone.js?**
A: Historically zone.js patched async browser APIs and triggered change detection for the whole component tree after any async event. Modern Angular is zoneless by default: change detection is scheduled only when Angular is explicitly notified — a signal read in a template changes, an input changes, a template event fires, the async pipe emits, or `markForCheck` is called. Combined with OnPush, only dirty components are checked.

**Q: What does `OnPush` mean?**
A: With OnPush a component is checked only when it's marked dirty: one of its inputs gets a new reference, an event handler in its template runs, a signal it reads changes, or it's marked manually. Since Angular 22 it's the default; the previous check-always behaviour is called `Eager`. In older codebases you set OnPush explicitly as a performance best practice, which also forces immutable data updates.

## Done when

- [ ] Можеш назвати ≥4 тригери, що позначають компонент dirty у zoneless/OnPush.
- [ ] Бачив(-ла) на експерименті, що plain field із `setTimeout` не оновлює шаблон, а signal — оновлює.
- [ ] Можеш пояснити, чому required input недоступний у constructor і чим замінюють `ngOnChanges`.
- [ ] Тимчасовий код експерименту видалено, застосунок збирається й працює як після уроку 5.

---
Docs: [Zoneless](https://angular.dev/guide/zoneless) · [Skipping component subtrees (OnPush)](https://angular.dev/best-practices/skipping-subtrees) · [Component lifecycle](https://angular.dev/guide/components/lifecycle)

[← Попередній: output(): подія від child до parent](05-output-child-to-parent.md) · [Наступний: Services та inject() →](../day-03-services-http/01-services-and-inject.md)
