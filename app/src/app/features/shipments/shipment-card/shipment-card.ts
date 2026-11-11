import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Shipment } from '../shipment.model';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-shipment-card',
  styleUrl: './shipment-card.css',
  templateUrl: './shipment-card.html',
})
export class ShipmentCard {
  readonly shipment = input.required<Shipment>();
  readonly delivered = output<number>();
}
