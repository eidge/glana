import { getDistance, getRhumbLineBearing } from 'geolib';
import { meters, Meter } from '../units/length';
import Quantity from '../units/quantity';
import { degrees, Degree } from '../units/angle';

class Position {
  latitude: Quantity<Degree>;
  longitude: Quantity<Degree>;
  altitude: Quantity<Meter>;

  constructor(
    latitude: Quantity<Degree>,
    longitude: Quantity<Degree>,
    altitude: Quantity<Meter> = meters(0)
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }

  distance2DTo(otherPosition: Position, accuracy: number = 0.1) {
    if (otherPosition === this) {
      return meters(0);
    }
    return meters(
      getDistance(
        this.rawCoordinates(),
        otherPosition.rawCoordinates(),
        accuracy
      )
    );
  }

  private rawCoordinates() {
    return { latitude: this.latitude.value, longitude: this.longitude.value };
  }

  heading2DTo(otherPosition: Position) {
    if (otherPosition === this) {
      return degrees(0);
    }
    return degrees(
      getRhumbLineBearing(this.rawCoordinates(), otherPosition.rawCoordinates())
    );
  }
}

export default Position;
