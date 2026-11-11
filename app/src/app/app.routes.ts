import { Routes } from '@angular/router';
import { ShipmentDetails } from './features/shipments/shipment-details/shipment-details';
import { ShipmentList } from './features/shipments/shipment-list/shipment-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'shipments' },
  { path: 'shipments', component: ShipmentList, title: 'Shipments · ParcelFlow Lite' },
  {
    // Must be declared before 'shipments/:id', otherwise "new" would be matched as an id.
    path: 'shipments/new',
    loadComponent: () =>
      import('./features/shipments/shipment-form/shipment-form').then((m) => m.ShipmentForm),
    title: 'New shipment · ParcelFlow Lite',
  },
  {
    path: 'shipments/new-reactive',
    loadComponent: () =>
      import('./features/shipments/shipment-form-reactive/shipment-form-reactive').then(
        (m) => m.ShipmentFormReactive,
      ),
    title: 'New shipment (Reactive Forms) · ParcelFlow Lite',
  },
  { path: 'shipments/:id', component: ShipmentDetails, title: 'Shipment details · ParcelFlow Lite' },
  { path: '**', redirectTo: 'shipments' },
];
