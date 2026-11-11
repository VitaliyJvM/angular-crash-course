# Day 1 — solutions

[English](../en/day-01.md) | **Українська**

> Не читай наперед. Спершу зроби власну спробу в уроці.

## Lesson 1.2 — production build

```bash
npx ng build
```

Результат — `dist/parcelflow-lite/browser/` (`index.html`, `main-<hash>.js`, `styles-<hash>.css`, `favicon.ico`). Розміри CLI друкує таблицею: для порожнього застосунку приблизно 200 kB raw / 55 kB estimated transfer.

## Lesson 1.3 — `<title>`

`src/index.html`:

```html
<title>ParcelFlow Lite</title>
```

TypeScript не потрібен: `index.html` — статичний файл. (Заголовки окремих сторінок пізніше задаватиме router через властивість `title` у route — Day 4.)

## Lesson 1.4 — заголовок і атрибути ізоляції

`shipment-list.html`:

```html
<h2>Shipments</h2>
```

У DevTools на `<app-shipment-list>` є атрибут `_nghost-…`, на `<h2>` — `_ngcontent-…`. Angular дописує ці атрибути до селекторів у CSS компонента, тому стилі не «протікають» в інші компоненти (emulated view encapsulation).

## Lesson 1.5 — кнопка Reset

`shipment-list.ts`:

```ts
protected reset(): void {
  this.parcelCount.set(3);
}
```

`shipment-list.html`:

```html
<button type="button" [disabled]="parcelCount() <= 3" (click)="reset()">Reset</button>
```

## Lesson 1.6 — куди переїхали ключі `@NgModule`

| `@NgModule` | Standalone-проєкт |
|-------------|-------------------|
| `declarations` | не потрібні: компоненти standalone |
| `imports` | `imports` конкретного компонента; для глобальних речей — `provide*()` в `app.config.ts` |
| `providers` | `app.config.ts` або сам сервіс (`@Service()` / `providedIn: 'root'`) |
| `bootstrap` | `bootstrapApplication(App, appConfig)` у `main.ts` |
