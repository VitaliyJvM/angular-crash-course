import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, required, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ShipmentStore } from '../shipment-store';
import { CARRIERS, NewShipment } from '../shipment.model';

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-shipment-form',
  styleUrl: './shipment-form.css',
  templateUrl: './shipment-form.html',
})
export class ShipmentForm {
  private readonly store = inject(ShipmentStore);
  private readonly router = inject(Router);

  protected readonly carriers = CARRIERS;

  // The model signal is the single source of truth; the form is a typed view over it.
  protected readonly model = signal<NewShipment>({ trackingNumber: '', carrier: '' });

  protected readonly shipmentForm = form(
    this.model,
    (path) => {
      required(path.trackingNumber, { message: 'Tracking number is required.' });
      pattern(path.trackingNumber, /^PF-\d{4}$/, { message: 'Use the format PF-0000.' });
      validate(path.trackingNumber, ({ value }) =>
        this.store.hasTrackingNumber(value())
          ? { kind: 'duplicate', message: 'This tracking number already exists.' }
          : null,
      );
      required(path.carrier, { message: 'Choose a carrier.' });
    },
    {
      submission: {
        // Runs only when the form is valid.
        action: async () => {
          this.store.add(this.model());
          await this.router.navigate(['/shipments']);
        },
      },
    },
  );

  constructor() {
    this.store.load(); // needed for the duplicate check when this page is opened directly
  }
}
