import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShipmentStore } from '../shipment-store';
import { CARRIERS } from '../shipment.model';

/**
 * Compact Reactive Forms version of ShipmentForm, kept for comparison only.
 * This is the approach you will meet in most existing enterprise codebases.
 */
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-shipment-form-reactive',
  template: `
    <h2>New shipment (Reactive Forms)</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <p>
        <label for="trackingNumber">Tracking number</label>
        <input id="trackingNumber" type="text" formControlName="trackingNumber" />
        @if (form.controls.trackingNumber.touched && form.controls.trackingNumber.errors; as errors) {
          @if (errors['required']) {
            <span class="error">Tracking number is required.</span>
          } @else if (errors['pattern']) {
            <span class="error">Use the format PF-0000.</span>
          }
        }
      </p>

      <p>
        <label for="carrier">Carrier</label>
        <select id="carrier" formControlName="carrier">
          <option value="">Select a carrier</option>
          @for (carrier of carriers; track carrier) {
            <option [value]="carrier">{{ carrier }}</option>
          }
        </select>
        @if (form.controls.carrier.touched && form.controls.carrier.invalid) {
          <span class="error">Choose a carrier.</span>
        }
      </p>

      <button type="submit">Add shipment</button>
    </form>
  `,
})
export class ShipmentFormReactive {
  private readonly store = inject(ShipmentStore);
  private readonly router = inject(Router);

  protected readonly carriers = CARRIERS;

  // The FormGroup owns the form state; validators are attached per control.
  protected readonly form = inject(FormBuilder).nonNullable.group({
    trackingNumber: ['', [Validators.required, Validators.pattern(/^PF-\d{4}$/)]],
    carrier: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.add(this.form.getRawValue());
    this.router.navigate(['/shipments']);
  }
}
