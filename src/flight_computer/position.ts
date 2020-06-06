import { getDistance } from 'geolib';
import { Meter } from 'units/length';

class Position {
  latitude: number;
  longitude: number;
  altitude: number;

  constructor(latitude: number, longitude: number, altitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }

  distance2DTo(otherPosition: Position, accuracy: number = 0.1) {
    return new Meter(getDistance(this, otherPosition, accuracy));
  }
}

export default Position;
