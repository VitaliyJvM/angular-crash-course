# Day 3 · Lesson 2 — DI: provider scopes і порівняння зі Spring

**Estimated time:** 5 хв · **Time budget:** read 2 · code 2 · try 0.5 · verify 0.5
**Learning outcome:** пояснити три рівні providers в Angular і чим Angular DI відрізняється від Spring IoC.

[← Попередній: Services та inject(): ShipmentStore](01-services-and-inject.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: HttpClient: GET із JSON fixture →](03-httpclient-get-fixture.md)

## Why it matters

Від того, де service «provided», залежить, скільки його екземплярів існує і коли вони знищуються. Помилка зі scope — типова причина «стан чомусь не спільний» або «стан чомусь не скидається».

## Concept

Injectors утворюють ієрархію; `inject()` шукає provider знизу вгору: component → route → application.

| Scope | Як оголосити | Екземпляр | Spring-аналог (приблизний) |
|---|---|---|---|
| Application | `@Service()` / `@Injectable({ providedIn: 'root' })` / `providers` в `app.config.ts` | один на застосунок | singleton bean |
| Route | `providers: [...]` в об'єкті `Route` | один на гілку маршрутів | — |
| Component | `providers: [...]` у `@Component` | новий на кожен екземпляр компонента, знищується разом із ним | дуже умовно prototype / request scope |

```ts
@Component({ providers: [ShipmentStore] /* свій екземпляр для цього компонента та його дітей */ })
```

Чим аналогія зі Spring неповна:

- немає classpath scanning — provider або auto-provided (`@Service()`), або явно вказаний у `providers`;
- auto-provided services tree-shakable: якщо ніхто не інжектить, код не потрапляє в bundle;
- resolution відбувається в runtime по дереву injectors, а не один раз при старті контексту;
- `inject()` працює лише в injection context (field initializer, constructor, factory), а не в довільному callback;
- `@Service({ autoProvided: false })` вимагає явного provider — ти сам обираєш scope.

Для значень без класу (config, URL) використовують `InjectionToken`: `const API_URL = new InjectionToken<string>('API_URL')` + `{ provide: API_URL, useValue: '/api' }` — аналог `@Value` / `@Qualifier`. React-паралель: component-level provider ≈ `<Context.Provider>` навколо піддерева.

## Follow along

1. У `shipment-store.ts` тимчасово додай у клас `constructor() { console.log('ShipmentStore created'); }`. Онови сторінку — у консолі один рядок: app-wide singleton, створений ліниво при першому `inject()`.
2. У `@Component` класу `ShipmentList` тимчасово додай `providers: [ShipmentStore]`. Застосунок працює так само, у консолі знову один рядок — але тепер це екземпляр рівня компонента: він зникне разом із `ShipmentList`, а інша сторінка отримала б свій.
3. Видали `providers: [ShipmentStore]` і `constructor` із `console.log`. Код має повернутися до стану після Lesson 1.

## Try it yourself

Без запуску коду дай відповідь: якщо додати `providers: [ShipmentStore]` у `@Component` класу `ShipmentCard` і викликати там `inject(ShipmentStore)`, скільки разів з'явиться `ShipmentStore created` для списку з 5 посилок і чому? (Перевірити відповідь можна в `exercises/solutions/day-03.md`.)

## Verify / Expected result

- Після кроку 3 `git diff` (або перегляд файлів) не показує змін відносно Lesson 1.
- Застосунок працює, у консолі немає `ShipmentStore created`.

## Common mistake / Best practice

**Пастка:** додати `providers: [SomeStore]` у компонент «про всяк випадок». Компонент отримує окремий екземпляр, і спільний стан мовчки перестає бути спільним.
**Правильно:** за замовчуванням app-wide (`@Service()`); component/route scope — лише свідомо, коли стан має жити й помирати разом із компонентом або фічею.

## Interview checkpoint

**Q: How does Angular decide which instance of a service to inject?**
A: Injectors are hierarchical. Angular starts at the requesting component's injector and walks up through parent components, then route and application injectors, and uses the first provider it finds. So a root-provided service is a singleton, while a service listed in a component's `providers` gets a new instance per component instance.

**Q: How does Angular DI compare to Spring?**
A: Same idea — inversion of control with singleton services by default. But Angular's injectors form a runtime tree tied to the component tree, providers are tree-shakable, there is no classpath scanning, and scopes are defined by where you provide the service rather than by a scope annotation.

## Done when

- [ ] Можеш назвати три рівні providers і тривалість життя екземпляра на кожному.
- [ ] Можеш назвати щонайменше дві відмінності Angular DI від Spring IoC.
- [ ] Тимчасові зміни з Follow along видалені.

---
Docs: [Defining dependency providers](https://angular.dev/guide/di/defining-dependency-providers) · [Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection) · [Injection context](https://angular.dev/guide/di/dependency-injection-context)
[← Попередній: Services та inject(): ShipmentStore](01-services-and-inject.md) · [Наступний: HttpClient: GET із JSON fixture →](03-httpclient-get-fixture.md)
