import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ShipmentStore } from '../shipment-store';
import { ShipmentForm } from './shipment-form';

describe('ShipmentForm', () => {
  let fixture: ComponentFixture<ShipmentForm>;
  let element: HTMLElement;
  let store: ShipmentStore;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClientTesting()] });
    fixture = TestBed.createComponent(ShipmentForm);
    store = TestBed.inject(ShipmentStore);
    TestBed.inject(HttpTestingController)
      .expectOne('data/shipments.json')
      .flush([{ id: 1, trackingNumber: 'PF-1001', carrier: 'DHL', status: 'CREATED', createdAt: '2026-11-02T09:15:00Z' }]);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  function fill(selector: string, value: string): void {
    const control = element.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
    control.value = value;
    control.dispatchEvent(new Event('input')); // browsers fire 'input' for <select> too
  }

  async function submit(): Promise<void> {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  it('shows validation errors and adds nothing when submitted empty', async () => {
    await submit();

    expect(element.textContent).toContain('Tracking number is required.');
    expect(element.textContent).toContain('Choose a carrier.');
    expect(store.shipments()).toHaveLength(1);
  });

  it('rejects a duplicate tracking number', async () => {
    fill('#trackingNumber', 'PF-1001');
    fill('#carrier', 'DHL');
    await submit();

    expect(element.textContent).toContain('This tracking number already exists.');
    expect(store.shipments()).toHaveLength(1);
  });

  it('adds a valid shipment and navigates back to the list', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fill('#trackingNumber', 'PF-2000');
    fill('#carrier', 'DHL');
    await submit();

    expect(store.hasTrackingNumber('PF-2000')).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/shipments']);
  });
});
