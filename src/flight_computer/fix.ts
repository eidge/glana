import Position from './position';
import { meters } from '../units/length';
import { degrees } from '../units/angle';

export default class Fix {
  timestamp: Date;
  gpsAltitude: number;
  pressureAltitude: number | null;
  position: Position;

  constructor(
    timestamp: Date,
    latitude: number,
    longitude: number,
    gpsAltitude: number,
    pressureAltitude: number | null = null
  ) {
    this.timestamp = timestamp;
    this.gpsAltitude = gpsAltitude;
    this.pressureAltitude = pressureAltitude;
    this.position = new Position(
      degrees(latitude),
      degrees(longitude),
      meters(pressureAltitude || gpsAltitude)
    );
  }
}
