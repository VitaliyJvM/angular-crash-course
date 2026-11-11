# Final challenge — Solution

[English](../en/final-challenge.md) | **Українська**

> **Не читайте до власної спроби.** Формулювання задачі: [docs/uk/lessons/day-05-quality-interview/06-final-challenge.md](../../../docs/uk/lessons/day-05-quality-interview/06-final-challenge.md).
> Розв'язок **не** входить у `app/` — reference-проєкт містить стан до challenge.

**Перевірено:** розв'язок (Required + Stretch) застосовано до копії `app/` (Angular 22.2, Vitest 5):
`npx ng test --no-watch --no-progress` → 4 test files, **13 tests passed**; `npx ng build` → успішно.

Усі шляхи — відносно `src/app/features/shipments/`.

## Required

### 1. `shipment-store.ts` — додати метод

```ts
  /** In-memory only, like add(): nothing is deleted on a server. */
  remove(id: number): void {
    this._shipments.update((shipments) => shipments.filter((s) => s.id !== id));
  }
```

`filter` повертає новий масив → signal сповіщає `counters` і `filteredShipments`. Невідомий `id` просто нічого не відфільтрує.

### 2. `shipment-card/shipment-card.ts` — новий output

```ts
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
  readonly delivered = output<number>();
  readonly removed = output<number>();
}
```

### 3. `shipment-card/shipment-card.html` — кнопка Delete

```html
  <div class="card-actions">
    <span class="status" [class]="'status-' + shipment().status">{{ shipment().status }}</span>

    @if (shipment().status !== 'DELIVERED') {
      <button type="button" (click)="delivered.emit(shipment().id)">Mark delivered</button>
    }

    <button type="button" (click)="removed.emit(shipment().id)">Delete</button>
  </div>
```

### 4. `shipment-list/shipment-list.html` — обробка події

```html
      <li>
        <app-shipment-card
          [shipment]="shipment"
          (delivered)="store.markDelivered($event)"
          (removed)="store.remove($event)"
        />
      </li>
```

`shipment-list.ts` для Required-частини не змінюється.

### 5. `shipment-store.spec.ts` — тест

```ts
  it('removes a shipment by id', () => {
    store.load();
    http.expectOne('data/shipments.json').flush(SHIPMENTS);

    store.remove(1);

    expect(store.shipments().map((s) => s.id)).toEqual([2]);
    expect(store.hasTrackingNumber('PF-1001')).toBe(false);
  });
```

### 6. `shipment-card/shipment-card.spec.ts` — виправити наявні тести

Тест `hides the button for delivered shipments` перевіряв `querySelector('button')` → `null`. Тепер у картці завжди є Delete, тому тест падає. Його намір — «немає кнопки **Mark delivered**», тож шукаємо кнопку за текстом:

```ts
  function buttonByText(text: string): HTMLButtonElement | undefined {
    return Array.from(element.querySelectorAll('button')).find((b) => b.textContent?.includes(text));
  }

  it('emits the shipment id when "Mark delivered" is clicked', () => {
    const emitted: number[] = [];
    fixture.componentInstance.delivered.subscribe((id) => emitted.push(id));

    buttonByText('Mark delivered')?.click();

    expect(emitted).toEqual([7]);
  });

  it('emits the shipment id when "Delete" is clicked', () => {
    const emitted: number[] = [];
    fixture.componentInstance.removed.subscribe((id) => emitted.push(id));

    buttonByText('Delete')?.click();

    expect(emitted).toEqual([7]);
  });

  it('hides the button for delivered shipments', async () => {
    fixture.componentRef.setInput('shipment', { ...SHIPMENT, status: 'DELIVERED' });
    await fixture.whenStable();

    expect(buttonByText('Mark delivered')).toBeUndefined();
    expect(buttonByText('Delete')).toBeDefined();
  });
```

(`buttonByText` оголошується всередині `describe`, після `beforeEach`. Тест на Delete у картці — понад вимоги challenge.)

## Stretch (Optional / Outside 5-hour course) — фільтр за перевізником

### `shipment-list/shipment-list.ts`

```ts
import { CARRIERS, SHIPMENT_STATUSES, ShipmentStatus } from '../shipment.model';

// ...у класі:
  protected readonly carriers = CARRIERS;
  protected readonly carrierFilter = signal('ALL');

  protected readonly filteredShipments = computed(() => {
    const filter = this.statusFilter();
    const carrier = this.carrierFilter();
    const term = this.debouncedSearchTerm().trim().toLowerCase();
    return this.store
      .shipments()
      .filter((s) => filter === 'ALL' || s.status === filter)
      .filter((s) => carrier === 'ALL' || s.carrier === carrier)
      .filter((s) => s.trackingNumber.toLowerCase().includes(term));
  });
```

### `shipment-list/shipment-list.html` — після блоку пошуку

```html
  <label class="search">
    Carrier
    <select #carrierSelect (change)="carrierFilter.set(carrierSelect.value)">
      <option value="ALL" [selected]="carrierFilter() === 'ALL'">All carriers</option>
      @for (carrier of carriers; track carrier) {
        <option [value]="carrier" [selected]="carrierFilter() === carrier">{{ carrier }}</option>
      }
    </select>
  </label>
```

Клас `search` перевикористано лише заради наявних стилів (grid + відступ).

## Що оцінити у власному розв'язку

- `remove` повертає новий масив (без `splice`).
- `ShipmentCard` не інжектить `ShipmentStore`.
- Новий фільтр — ще одна залежність **того самого** `computed`, а не окремий `signal` із відфільтрованим списком.
- Зламаний тест виправлено за наміром, а не видалено.

## З реальним backend (поза курсом)

`remove` викликав би `DELETE /api/shipments/{id}` через `ShipmentApi` і оновлював signal після успішної відповіді (або optimistic update з rollback у `error`).
