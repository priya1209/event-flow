export class CreateEventDto {
  title!: string;
  description?: string;
  location!: string;
  date!: string;
  maxCapacity?: number;
  price?: number;
  organizerId?: number;
  lat?: number;
  lng?: number;
}
