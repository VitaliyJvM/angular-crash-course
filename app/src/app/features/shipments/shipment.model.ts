export const SHIPMENT_STATUSES = ['CREATED', 'IN_TRANSIT', 'DELIVERED'] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const CARRIERS = ['Nova Poshta', 'Ukrposhta', 'DHL'] as const;

export interface TrackingEvent {
  timestamp: string; // ISO 8601
  location: string;
  description: string;
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  createdAt: string; // ISO 8601, as it would arrive from a REST API
  events?: TrackingEvent[];
}

/** What the "new shipment" form collects; id, status and createdAt are assigned by the store. */
export type NewShipment = Pick<Shipment, 'trackingNumber' | 'carrier'>;
