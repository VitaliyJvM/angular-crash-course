import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Shipment } from '../shipment.model';
import { ShipmentCard } from './shipment-card';

const SHIPMENT: Shipment = {
  id: 7,
  trackingNumber: 'PF-7777',
  carrier: 'DHL',
  status: 'IN_TRANSIT',
  createdAt: '2026-11-02T09:15:00Z',
};

describe('ShipmentCard', () => {
  let fixture: ComponentFixture<ShipmentCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] }); // the card uses RouterLink
    fixture = TestBed.createComponent(ShipmentCard);
    fixture.componentRef.setInput('shipment', SHIPMENT); // required input must be set before first render
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('renders the tracking number and status', () => {
    expect(element.textContent).toContain('PF-7777');
    expect(element.querySelector('.status')?.textContent).toContain('IN_TRANSIT');
  });

  it('emits the shipment id when "Mark delivered" is clicked', () => {
    const emitted: number[] = [];
    fixture.componentInstance.delivered.subscribe((id) => emitted.push(id));

    element.querySelector('button')?.click();

    expect(emitted).toEqual([7]);
  });

  it('hides the button for delivered shipments', async () => {
    fixture.componentRef.setInput('shipment', { ...SHIPMENT, status: 'DELIVERED' });
    await fixture.whenStable();

    expect(element.querySelector('button')).toBeNull();
  });
});
