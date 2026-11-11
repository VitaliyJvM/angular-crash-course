# Final challenge — Solution

**English** | [Українська](../uk/final-challenge.md)

> **Don't read this before your own attempt.** Task statement: [docs/en/lessons/day-05-quality-interview/06-final-challenge.md](../../../docs/en/lessons/day-05-quality-interview/06-final-challenge.md).
> The solution is **not** part of `app/` — the reference project contains the state before the challenge.

**Verified:** the solution (Required + Stretch) was applied to a copy of `app/` (Angular 22.2, Vitest 5):
`npx ng test --no-watch --no-progress` → 4 test files, **13 tests passed**; `npx ng build` → successful.

All paths are relative to `src/app/features/shipments/`.

## Required

### 1. `shipment-store.ts` — add a method

```ts
  /** In-memory only, like add(): nothing is deleted on a server. */
  remove(id: number): void {
    this._shipments.update((shipments) => shipments.filter((s) => s.id !== id));
  }
```

`filter` returns a new array → the signal notifies `counters` and `filteredShipments`. An unknown `id` simply filters nothing out.

### 2. `shipment-card/shipment-card.ts` — a new output

```ts
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
  readonly delivered = output<number>();
  readonly removed = output<number>();
}
```

### 3. `shipment-card/shipment-card.html` — the Delete button

```html
  <div class="card-actions">
    <span class="status" [class]="'status-' + shipment().status">{{ shipment().status }}</span>

    @if (shipment().status !== 'DELIVERED') {
      <button type="button" (click)="delivered.emit(shipment().id)">Mark delivered</button>
    }

    <button type="button" (click)="removed.emit(shipment().id)">Delete</button>
  </div>
```

### 4. `shipment-list/shipment-list.html` — handling the event

```html
      <li>
        <app-shipment-card
          [shipment]="shipment"
          (delivered)="store.markDelivered($event)"
          (removed)="store.remove($event)"
        />
      </li>
```

`shipment-list.ts` does not change for the Required part.

### 5. `shipment-store.spec.ts` — a test

```ts
  it('removes a shipment by id', () => {
    store.load();
    http.expectOne('data/shipments.json').flush(SHIPMENTS);

    store.remove(1);

    expect(store.shipments().map((s) => s.id)).toEqual([2]);
    expect(store.hasTrackingNumber('PF-1001')).toBe(false);
  });
```

### 6. `shipment-card/shipment-card.spec.ts` — fix the existing tests

The `hides the button for delivered shipments` test checked `querySelector('button')` → `null`. Now the card always has Delete, so the test fails. Its intent is "there is no **Mark delivered** button", so we look the button up by its text:

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

(`buttonByText` is declared inside `describe`, after `beforeEach`. The test for Delete in the card goes beyond the requirements of the challenge.)

## Stretch (Optional / Outside 5-hour course) — carrier filter

### `shipment-list/shipment-list.ts`

```ts
import { CARRIERS, SHIPMENT_STATUSES, ShipmentStatus } from '../shipment.model';

// ...in the class:
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

### `shipment-list/shipment-list.html` — after the search block

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

The `search` class is reused only for the sake of the existing styles (grid + spacing).

## What to evaluate in your own solution

- `remove` returns a new array (no `splice`).
- `ShipmentCard` does not inject `ShipmentStore`.
- The new filter is one more dependency of **the same** `computed`, not a separate `signal` holding the filtered list.
- The broken test is fixed according to its intent, not deleted.

## With a real backend (outside the course)

`remove` would call `DELETE /api/shipments/{id}` through `ShipmentApi` and update the signal after a successful response (or an optimistic update with a rollback in `error`).
