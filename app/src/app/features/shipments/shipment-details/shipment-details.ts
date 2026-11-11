import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShipmentStore } from '../shipment-store';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-shipment-details',
  templateUrl: './shipment-details.html',
})
export class ShipmentDetails {
  protected readonly store = inject(ShipmentStore);

  /** Bound from the ':id' route parameter by withComponentInputBinding(). Always a string. */
  readonly id = input.required<string>();

  protected readonly shipment = computed(() =>
    this.store.shipments().find((s) => s.id === Number(this.id())),
  );

  constructor() {
    this.store.load(); // makes a direct link / page reload on /shipments/:id work
  }
}
