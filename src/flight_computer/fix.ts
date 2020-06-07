import Position from './position';
import { Meter } from 'units/length';

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
      new Meter(pressureAltitude || gpsAltitude)
    );
  }
}

export default Fix;
