# Angular 22 — cheat sheet

[English](../../en/reference/angular-cheatsheet.md) | **Українська**

Усі приклади відповідають коду ParcelFlow Lite (`app/`).

## CLI

```bash
npx @angular/cli@22 new <name> --style css --ssr false   # новий workspace
npm start                         # ng serve → http://localhost:4200
npx ng generate component features/shipments/shipment-card --skip-tests
npx ng generate service features/shipments/shipment-store --skip-tests
npx ng test                       # Vitest, watch mode
npx ng test --no-watch            # одноразовий запуск
npx ng build                      # production build → dist/
npx ng update                     # оновлення версій із migrations
```

## Component

```ts
@Component({
  selector: 'app-shipment-card',
  imports: [DatePipe, RouterLink],      // залежності template
  templateUrl: './shipment-card.html',
  styleUrl: './shipment-card.css',
})
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();  // parent → child
  readonly compact = input(false);                 // input із default
  readonly delivered = output<number>();           // child → parent
}
```

```html
<app-shipment-card [shipment]="s" (delivered)="store.markDelivered($event)" />
```

## Template syntax

| Синтаксис | Призначення |
|-----------|-------------|
| `{{ value() }}` | interpolation |
| `[prop]="expr"` | property binding |
| `[attr.aria-pressed]="expr"` | attribute binding |
| `[class.active]="cond"` · `[style.width.px]="n"` | class / style binding |
| `(click)="handler($event)"` | event binding |
| `[(value)]="sig"` | two-way binding |
| `#ref` | template reference variable |
| `{{ date | date: 'mediumDate' }}` | pipe |
| `@if (a) {…} @else if (b; as x) {…} @else {…}` | умови |
| `@for (i of items(); track i.id) {…} @empty {…}` | цикл (`track` обов'язковий) |
| `@switch (x) { @case (1) {…} @default {…} }` | switch |
| `@let total = items().length;` | локальна змінна template |
| `@defer (on viewport) {…}` | відкладене завантаження блоку |

Legacy: `*ngIf`, `*ngFor`, `*ngSwitchCase`, `[ngClass]`, `@Input()`, `@Output()`.

## Signals

```ts
const count = signal(0);                 // WritableSignal<number>
count.set(1);
count.update((c) => c + 1);
const double = computed(() => count() * 2);   // readonly, lazy, memoized
const readonly = count.asReadonly();

effect(() => console.log(count()));      // side effect; лише в injection context

// масиви й об'єкти — тільки immutable-оновлення
list.update((items) => [...items, item]);
list.update((items) => items.map((i) => (i.id === id ? { ...i, done: true } : i)));
```

Також: `linkedSignal()` (writable-стан, що скидається при зміні джерела), `untracked()`, `model()` (two-way input).

## RxJS interop

```ts
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

const debounced = toSignal(
  toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
  { initialValue: '' },
);                                           // toSignal сам відписується

stream$.pipe(takeUntilDestroyed()).subscribe(...);   // ручна підписка без leak
```

У template для Observable: `{{ value$ | async }}` (`AsyncPipe`).

## Services і DI

```ts
@Service()                                   // v22: app-wide singleton
export class ShipmentApi {
  private readonly http = inject(HttpClient);
  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>('data/shipments.json');
  }
}

// у legacy-коді те саме:
@Injectable({ providedIn: 'root' })
export class ShipmentApi { constructor(private http: HttpClient) {} }
```

| Scope | Як оголосити | Час життя |
|-------|--------------|-----------|
| Application | `@Service()` / `providedIn: 'root'` / `appConfig.providers` | увесь застосунок |
| Route | `providers` у route | поки активне піддерево routes |
| Component | `providers` у `@Component` | разом з екземпляром компонента |

`inject()` працює лише в injection context: field initializer, constructor, factory provider.

## HTTP

```ts
this.http.get<Shipment[]>(url);                      // Observable, cold, completes
this.http.post<Shipment>(url, body);
provideHttpClient(withInterceptors([authInterceptor]));   // лише для конфігурації

// signal-based альтернатива для читання
const shipments = httpResource<Shipment[]>(() => 'data/shipments.json');
shipments.isLoading(); shipments.error(); shipments.hasValue(); shipments.value(); shipments.reload();
```

## Router

```ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'shipments' },
  { path: 'shipments', component: ShipmentList, title: 'Shipments' },
  { path: 'shipments/new', loadComponent: () => import('./…/shipment-form').then((m) => m.ShipmentForm) },
  { path: 'shipments/:id', component: ShipmentDetails },
  { path: '**', redirectTo: 'shipments' },
];

provideRouter(routes, withComponentInputBinding());   // :id → input()
```

```html
<a routerLink="/shipments" routerLinkActive="active" ariaCurrentWhenActive="page">Shipments</a>
<a [routerLink]="['/shipments', shipment.id]">…</a>
<router-outlet />
```

```ts
readonly id = input.required<string>();              // route param
inject(Router).navigate(['/shipments']);             // навігація з коду
inject(ActivatedRoute).snapshot.paramMap.get('id');  // класичний спосіб
```

## Forms

```ts
// Signal Forms (v22+) — @angular/forms/signals
model = signal<NewShipment>({ trackingNumber: '', carrier: '' });
shipmentForm = form(this.model, (path) => {
  required(path.trackingNumber, { message: 'Required.' });
  pattern(path.trackingNumber, /^PF-\d{4}$/, { message: 'Use PF-0000.' });
}, { submission: { action: async () => { /* save */ } } });
```

```html
<form [formRoot]="shipmentForm">
  <input [formField]="shipmentForm.trackingNumber" />
  @if (shipmentForm.trackingNumber().touched() && shipmentForm.trackingNumber().invalid()) { … }
</form>
```

```ts
// Reactive Forms — @angular/forms
form = inject(FormBuilder).nonNullable.group({
  trackingNumber: ['', [Validators.required, Validators.pattern(/^PF-\d{4}$/)]],
});
// <form [formGroup]="form" (ngSubmit)="submit()"> <input formControlName="trackingNumber" />
```

Template-driven: `FormsModule`, `[(ngModel)]="model.field"`, `#f="ngForm"`.

## Lifecycle

`constructor` / field initializers → `ngOnChanges` (для decorator-inputs; перший виклик — до `ngOnInit`) → `ngOnInit` → `afterNextRender` / `afterEveryRender` → `ngOnDestroy` (або `inject(DestroyRef).onDestroy(...)`).

## Change detection (v22)

- Zoneless за замовчуванням: Angular дізнається про зміни через signals, events у template, `markForCheck()`, `async` pipe.
- `ChangeDetectionStrategy.OnPush` — default; `Eager` — стара стратегія «перевіряти завжди».
- Зміна звичайного поля в `setTimeout` чи `subscribe` **не** оновить view — використовуй signal.

## Testing (Vitest + TestBed)

```ts
TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClientTesting()] });

const store = TestBed.inject(ShipmentStore);
const http = TestBed.inject(HttpTestingController);
http.expectOne('data/shipments.json').flush(data);
http.verify();

const fixture = TestBed.createComponent(ShipmentCard);
fixture.componentRef.setInput('shipment', SHIPMENT);
await fixture.whenStable();
fixture.nativeElement.querySelector('button')?.click();
```
