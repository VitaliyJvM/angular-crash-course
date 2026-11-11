# Day 1 · Lesson 6 — NgModules vs Standalone

[English](../../../en/lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) | **Українська**

**Estimated time:** 5 хв · **Time budget:** read 3 · follow 1 · try/verify 1

**Learning outcome:** можеш пояснити, навіщо існували NgModules, чим їх замінили standalone components і як читати legacy-код.

[← Попередній: Template bindings](05-template-bindings.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Typed model, @for та @if →](../day-02-components-state/01-typed-model-and-control-flow.md)

## Why it matters

Більшість enterprise-проєктів, написаних до 2023 року, побудовані на NgModules, і питання «standalone vs NgModule» — одне з найчастіших на співбесідах. Нові застосунки на NgModules не будують.

## Concept

**NgModule** (до Angular 14 — єдиний спосіб) — клас із `@NgModule`, що об'єднував компоненти в одиницю компіляції: що оголошено, що імпортовано, що експортовано, які providers. Компонент не міг існувати поза модулем.

```ts
// LEGACY: так виглядає код на NgModules
@NgModule({
  declarations: [AppComponent, ShipmentListComponent], // компоненти цього модуля
  imports: [BrowserModule, HttpClientModule],          // інші модулі
  providers: [ShipmentService],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

**Standalone component** сам перелічує залежності свого template в `imports`; глобальна конфігурація — функції `provide*()` в `app.config.ts`.

| | NgModules (legacy) | Standalone (сучасний default) |
|---|---|---|
| Залежності template | `declarations` + `imports` модуля | `imports` самого компонента |
| Bootstrap | `bootstrapModule(AppModule)` | `bootstrapApplication(App, appConfig)` |
| Глобальні сервіси | `HttpClientModule`, `RouterModule.forRoot()` | `provideHttpClient()`, `provideRouter()` |
| Lazy loading | `loadChildren` → модуль | `loadComponent` / `loadChildren` → routes |
| Статус | підтримується, у нових проєктах не рекомендовано | default з Angular 19 (`standalone: true` писати не треба) |

Де NgModules ще трапляються: старі застосунки, деякі сторонні бібліотеки (їхній модуль просто додають у `imports` standalone-компонента), а також `FormsModule` / `ReactiveFormsModule` (Day 4). Обидва підходи можна змішувати, тому міграція відбувається поступово (`ng generate @angular/core:standalone`).

> Паралель зі Spring: NgModule трохи схожий на `@Configuration` + component scan для частини застосунку. Аналогія неповна — NgModule ще й визначав область видимості компонентів у templates.

## Follow along

1. У `src/app/app.ts` тимчасово прибери `ShipmentList` з масиву `imports` (ES-import залиш) і збережи.
2. Подивись на помилку в терміналі: `NG8001: 'app-shipment-list' is not a known element`. У світі NgModules ту саму помилку виправляли б у `declarations`/`imports` модуля — тобто в іншому файлі.
3. Поверни `ShipmentList` в `imports`.

## Try it yourself

Подивись на legacy-фрагмент у блоці Concept і скажи, в який файл сучасного проєкту «переїхав» кожен із чотирьох ключів `@NgModule`.

## Verify / Expected result

`declarations` → зникли (компоненти standalone); `imports` → `imports` кожного компонента або `provide*()` в `app.config.ts`; `providers` → `app.config.ts` чи сам сервіс; `bootstrap` → `bootstrapApplication` у `main.ts`. Застосунок знову збирається без помилок.

## Common mistake / Best practice

**Помилка:** у новому проєкті створити `SharedModule` «для всього спільного». **Наслідок:** кожен компонент тягне зайві залежності, tree-shaking гіршає. **Правильно:** імпортуй у компонент рівно ті standalone-компоненти, directives і pipes, які використовує його template.

## Interview checkpoint

**Q: What are NgModules and why did Angular move to standalone components?**

A: NgModules were containers that declared components and configured their compilation context and providers. They added indirection: to understand a component's dependencies you had to read its module. Standalone components declare their own dependencies, which simplifies the mental model, improves tree-shaking and makes lazy loading of a single component possible. NgModules are still supported for existing code and libraries.

## Done when

- [ ] Можеш назвати 4 ключі `@NgModule` і їхні сучасні відповідники.
- [ ] Бачив помилку `NG8001` і знаєш, як її виправити.
- [ ] Day 1 завершено: відміть прогрес у [PROGRESS.md](../../PROGRESS.md).

---
Docs: [NgModules](https://angular.dev/guide/ngmodules/overview) · [Migrate to standalone](https://angular.dev/reference/migrations/standalone)

[← Попередній: Template bindings](05-template-bindings.md) · [Наступний: Typed model, @for та @if →](../day-02-components-state/01-typed-model-and-control-flow.md)
