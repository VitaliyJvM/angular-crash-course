# Angular 22 — cheat sheet

**English** | [Українська](../../uk/reference/angular-cheatsheet.md)

All examples match the ParcelFlow Lite code (`app/`).

## CLI

```bash
npx @angular/cli@22 new <name> --style css --ssr false   # new workspace
npm start                         # ng serve → http://localhost:4200
npx ng generate component features/shipments/shipment-card --skip-tests
npx ng generate service features/shipments/shipment-store --skip-tests
npx ng test                       # Vitest, watch mode
npx ng test --no-watch            # single run
npx ng build                      # production build → dist/
npx ng update                     # version updates with migrations
```

## Component

```ts
@Component({
  selector: 'app-shipment-card',
  imports: [DatePipe, RouterLink],      // template dependencies
  templateUrl: './shipment-card.html',
  styleUrl: './shipment-card.css',
})
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();  // parent → child
  readonly compact = input(false);                 // input with a default
  readonly delivered = output<number>();           // child → parent
}
```

```html
<app-shipment-card [shipment]="s" (delivered)="store.markDelivered($event)" />
```

## Template syntax

| Syntax | Purpose |
|-----------|-------------|
| `{{ value() }}` | interpolation |
| `[prop]="expr"` | property binding |
| `[attr.aria-pressed]="expr"` | attribute binding |
| `[class.active]="cond"` · `[style.width.px]="n"` | class / style binding |
| `(click)="handler($event)"` | event binding |
| `[(value)]="sig"` | two-way binding |
| `#ref` | template reference variable |
| `{{ date | date: 'mediumDate' }}` | pipe |
| `@if (a) {…} @else if (b; as x) {…} @else {…}` | conditionals |
| `@for (i of items(); track i.id) {…} @empty {…}` | loop (`track` is required) |
| `@switch (x) { @case (1) {…} @default {…} }` | switch |
| `@let total = items().length;` | local template variable |
| `@defer (on viewport) {…}` | deferred loading of a block |

Legacy: `*ngIf`, `*ngFor`, `*ngSwitchCase`, `[ngClass]`, `@Input()`, `@Output()`.

## Signals

```ts
const count = signal(0);                 // WritableSignal<number>
count.set(1);
count.update((c) => c + 1);
const double = computed(() => count() * 2);   // readonly, lazy, memoized
const readonly = count.asReadonly();

effect(() => console.log(count()));      // side effect; only in an injection context

// arrays and objects — immutable updates only
list.update((items) => [...items, item]);
list.update((items) => items.map((i) => (i.id === id ? { ...i, done: true } : i)));
```

Also: `linkedSignal()` (writable state that resets when its source changes), `untracked()`, `model()` (two-way input).

## RxJS interop

```ts
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

const debounced = toSignal(
  toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
  { initialValue: '' },
);                                           // toSignal unsubscribes on its own

stream$.pipe(takeUntilDestroyed()).subscribe(...);   // manual subscription without a leak
```

In a template, for an Observable: `{{ value$ | async }}` (`AsyncPipe`).

## Services and DI

```ts
@Service()                                   // v22: app-wide singleton
export class ShipmentApi {
  private readonly http = inject(HttpClient);
  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>('data/shipments.json');
  }
}

// the same in legacy code:
@Injectable({ providedIn: 'root' })
export class ShipmentApi { constructor(private http: HttpClient) {} }
```

| Scope | How to declare | Lifetime |
|-------|--------------|-----------|
| Application | `@Service()` / `providedIn: 'root'` / `appConfig.providers` | the whole application |
| Route | `providers` on a route | while the route subtree is active |
| Component | `providers` in `@Component` | together with the component instance |

`inject()` works only in an injection context: field initializer, constructor, factory provider.

## HTTP

```ts
this.http.get<Shipment[]>(url);                      // Observable, cold, completes
this.http.post<Shipment>(url, body);
provideHttpClient(withInterceptors([authInterceptor]));   // for configuration only

// signal-based alternative for reads
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
inject(Router).navigate(['/shipments']);             // programmatic navigation
inject(ActivatedRoute).snapshot.paramMap.get('id');  // the classic way
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

`constructor` / field initializers → `ngOnChanges` (for decorator inputs; first call runs before `ngOnInit`) → `ngOnInit` → `afterNextRender` / `afterEveryRender` → `ngOnDestroy` (or `inject(DestroyRef).onDestroy(...)`).

## Change detection (v22)

- Zoneless by default: Angular learns about changes through signals, template events, `markForCheck()` and the `async` pipe.
- `ChangeDetectionStrategy.OnPush` is the default; `Eager` is the old "always check" strategy.
- Changing a plain field inside `setTimeout` or `subscribe` will **not** update the view — use a signal.

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
