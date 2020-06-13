import { getDistance } from 'geolib';
import { meters, Meter } from 'units/length';
import Quantity from 'units/quantity';

class Position {
  latitude: number;
  longitude: number;
  altitude: Quantity<Meter>;

  constructor(latitude: number, longitude: number, altitude: Quantity<Meter>) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }

  distance2DTo(otherPosition: Position, accuracy: number = 0.1) {
    return meters.create(getDistance(this, otherPosition, accuracy));
  }
}

export default Position;
