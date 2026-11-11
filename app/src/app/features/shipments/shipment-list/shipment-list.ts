import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ShipmentCard } from '../shipment-card/shipment-card';
import { ShipmentStore } from '../shipment-store';
import { SHIPMENT_STATUSES, ShipmentStatus } from '../shipment.model';

type StatusFilter = ShipmentStatus | 'ALL';

@Component({
  imports: [ShipmentCard],
  selector: 'app-shipment-list',
  styleUrl: './shipment-list.css',
  templateUrl: './shipment-list.html',
})
export class ShipmentList {
  protected readonly store = inject(ShipmentStore);

  protected readonly filterOptions: StatusFilter[] = ['ALL', ...SHIPMENT_STATUSES];
  protected readonly statusFilter = signal<StatusFilter>('ALL');

  // Signal -> Observable (time-based operators) -> Signal. toSignal unsubscribes on destroy.
  protected readonly searchTerm = signal('');
  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly filteredShipments = computed(() => {
    const filter = this.statusFilter();
    const term = this.debouncedSearchTerm().trim().toLowerCase();
    return this.store
      .shipments()
      .filter((s) => filter === 'ALL' || s.status === filter)
      .filter((s) => s.trackingNumber.toLowerCase().includes(term));
  });

  protected readonly counters = computed(() => {
    const shipments = this.store.shipments();
    return {
      total: shipments.length,
      inTransit: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
      delivered: shipments.filter((s) => s.status === 'DELIVERED').length,
    };
  });

  constructor() {
    this.store.load();
  }
}
