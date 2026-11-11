# Day 1 — solutions

**English** | [Українська](../uk/day-01.md)

> Don't read ahead. First make your own attempt in the lesson.

## Lesson 1.2 — production build

```bash
npx ng build
```

The result is `dist/parcelflow-lite/browser/` (`index.html`, `main-<hash>.js`, `styles-<hash>.css`, `favicon.ico`). The CLI prints the sizes as a table: for an empty application, roughly 200 kB raw / 55 kB estimated transfer.

## Lesson 1.3 — `<title>`

`src/index.html`:

```html
<title>ParcelFlow Lite</title>
```

No TypeScript is needed: `index.html` is a static file. (The titles of individual pages will later be set by the router through the `title` property of a route — Day 4.)

## Lesson 1.4 — heading and encapsulation attributes

`shipment-list.html`:

```html
<h2>Shipments</h2>
```

In DevTools, `<app-shipment-list>` has an `_nghost-…` attribute and `<h2>` has `_ngcontent-…`. Angular appends these attributes to the selectors in the component's CSS, so styles don't "leak" into other components (emulated view encapsulation).

## Lesson 1.5 — Reset button

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

## Lesson 1.6 — where the `@NgModule` keys moved

| `@NgModule` | Standalone project |
|-------------|--------------------|
| `declarations` | not needed: components are standalone |
| `imports` | `imports` of the specific component; for global things — `provide*()` in `app.config.ts` |
| `providers` | `app.config.ts` or the service itself (`@Service()` / `providedIn: 'root'`) |
| `bootstrap` | `bootstrapApplication(App, appConfig)` in `main.ts` |
