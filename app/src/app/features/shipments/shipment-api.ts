import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Shipment } from './shipment.model';

/** Data access only: knows URLs and HTTP, holds no state. */
@Service()
export class ShipmentApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Shipment[]> {
    // Static fixture served from public/. GET works; POST/PUT/DELETE would not persist anything.
    return this.http.get<Shipment[]>('data/shipments.json');
  }
}
