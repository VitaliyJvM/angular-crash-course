import { inject, Service, signal } from '@angular/core';
import { ShipmentApi } from './shipment-api';
import { NewShipment, Shipment } from './shipment.model';

/** Feature state: a single source of truth for shipments, exposed as read-only signals. */
@Service()
export class ShipmentStore {
  private readonly api = inject(ShipmentApi);

  private readonly _shipments = signal<Shipment[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private loaded = false;

  readonly shipments = this._shipments.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Loads the fixture once; later calls are no-ops so in-memory changes are not overwritten. */
  load(): void {
    if (this.loaded || this._loading()) {
      return;
    }
    this._loading.set(true);
    this._error.set(null);

    // HttpClient observables emit once and complete, so this subscription cleans itself up.
    this.api.getAll().subscribe({
      next: (shipments) => {
        this._shipments.set(shipments);
        this.loaded = true;
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Could not load shipments. Please try again.');
        this._loading.set(false);
      },
    });
  }

  markDelivered(id: number): void {
    this._shipments.update((shipments) =>
      shipments.map((s) => (s.id === id ? { ...s, status: 'DELIVERED' } : s)),
    );
  }

  hasTrackingNumber(trackingNumber: string): boolean {
    return this._shipments().some((s) => s.trackingNumber === trackingNumber);
  }

  /** In-memory only: there is no backend, so the new shipment disappears on page reload. */
  add(draft: NewShipment): Shipment {
    const shipment: Shipment = {
      ...draft,
      id: Math.max(0, ...this._shipments().map((s) => s.id)) + 1,
      status: 'CREATED',
      createdAt: new Date().toISOString(),
      events: [],
    };
    this._shipments.update((shipments) => [...shipments, shipment]);
    return shipment;
  }
}
