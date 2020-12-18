import { meters, Meter, Length } from '../units/length';
import Quantity from '../units/quantity';
import { Degree, Angle } from '../units/angle';
import { distance2D, heading2D, translatePosition } from '../math/geo';

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

  distance2DTo(otherPosition: Position) {
    return distance2D(this, otherPosition);
  }

  heading2DTo(otherPosition: Position) {
    return heading2D(this, otherPosition);
  }

  move(
    distance: Quantity<Length>,
    heading: Quantity<Angle>,
    altitudeDelta: Quantity<Length> = meters(0)
  ) {
    return translatePosition(this, distance, heading, altitudeDelta);
  }
}

export default Position;
