import Position from './position';
import { meters } from '../units/length';
import { degrees } from '../units/angle';

export interface FixExtras {
  engineNoiseLevel?: number;
}

export default class Fix {
  timestamp: Date;
  position: Position;
  gpsAltitude: number;
  pressureAltitude: number | null;
  engineNoiseLevel: number | null;

  constructor(
    timestamp: Date,
    latitude: number,
    longitude: number,
    gpsAltitude: number,
    pressureAltitude: number | null = null,
    extras: FixExtras = {}
  ) {
    this.timestamp = timestamp;
    this.gpsAltitude = gpsAltitude;
    this.pressureAltitude = pressureAltitude;
    this.position = new Position(
      degrees(latitude),
      degrees(longitude),
      meters(pressureAltitude || gpsAltitude)
    );
    this.engineNoiseLevel = extras.engineNoiseLevel || null;
  }
}
