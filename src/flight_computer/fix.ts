import Position from './position';
import { meters } from 'units/length';

class Fix {
  updatedAt: Date;
  gpsAltitude: number;
  pressureAltitude: number | null;
  position: Position;

  constructor(
    updatedAt: Date,
    latitude: number,
    longitude: number,
    gpsAltitude: number,
    pressureAltitude: number | null = null
  ) {
    this.updatedAt = updatedAt;
    this.gpsAltitude = gpsAltitude;
    this.pressureAltitude = pressureAltitude;
    this.position = new Position(
      latitude,
      longitude,
      meters.create(pressureAltitude || gpsAltitude)
    );
  }
}

export default Fix;
