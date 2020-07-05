import Position from './position';
import { meters } from '../units/length';
import { degrees } from '../units/angle';

export default class Fix {
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
      degrees(latitude),
      degrees(longitude),
      meters(pressureAltitude || gpsAltitude)
    );
  }
}
