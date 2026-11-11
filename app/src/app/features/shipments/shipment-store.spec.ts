import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ShipmentStore } from './shipment-store';
import { Shipment } from './shipment.model';

const SHIPMENTS: Shipment[] = [
  { id: 1, trackingNumber: 'PF-1001', carrier: 'DHL', status: 'IN_TRANSIT', createdAt: '2026-11-02T09:15:00Z' },
  { id: 2, trackingNumber: 'PF-1002', carrier: 'Ukrposhta', status: 'DELIVERED', createdAt: '2026-10-28T14:40:00Z' },
];

describe('ShipmentStore', () => {
  let store: ShipmentStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    store = TestBed.inject(ShipmentStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // fails the test if a request was left unanswered

  it('loads shipments and toggles the loading flag', () => {
    store.load();
    expect(store.loading()).toBe(true);

    http.expectOne('data/shipments.json').flush(SHIPMENTS);

    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.shipments()).toEqual(SHIPMENTS);
  });

  it('exposes an error message when the request fails', () => {
    store.load();

    http.expectOne('data/shipments.json').flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(store.loading()).toBe(false);
    expect(store.error()).toContain('Could not load shipments');
    expect(store.shipments()).toEqual([]);
  });

  it('adds a shipment in memory with the next id and CREATED status', () => {
    store.load();
    http.expectOne('data/shipments.json').flush(SHIPMENTS);

    const created = store.add({ trackingNumber: 'PF-2000', carrier: 'DHL' });

    expect(created.id).toBe(3);
    expect(created.status).toBe('CREATED');
    expect(store.shipments()).toHaveLength(3);
    expect(store.hasTrackingNumber('PF-2000')).toBe(true);
  });
});
