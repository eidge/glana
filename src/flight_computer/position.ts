import {
  getDistance,
  getRhumbLineBearing,
  computeDestinationPoint,
} from 'geolib';
import { meters, Meter, Length } from '../units/length';
import Quantity from '../units/quantity';
import { degrees, Degree, Angle } from '../units/angle';

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

  move(distance: Quantity<Length>, heading: Quantity<Angle>) {
    let point = computeDestinationPoint(
      this.rawCoordinates(),
      distance.convertTo(meters).value,
      heading.convertTo(degrees).value
    );

    return new Position(
      degrees(point.latitude),
      degrees(point.longitude),
      this.altitude
    );
  }
}

export default Position;
