import Position from '../flight_computer/position';
import { degrees, Angle } from '../units/angle';
import { meters, Length } from '../units/length';
import {
  getDistance,
  getRhumbLineBearing,
  computeDestinationPoint,
} from 'geolib';
import Quantity from 'units/quantity';

function positionToGeoLibCoordinates(position: Position) {
  return {
    latitude: position.latitude.convertTo(degrees).value,
    longitude: position.longitude.convertTo(degrees).value,
  };
}

export function distance2D(
  position: Position,
  otherPosition: Position,
  accuracy: number = 0.1
) {
  if (position === otherPosition) {
    return meters(0);
  }

  return meters(
    getDistance(
      positionToGeoLibCoordinates(position),
      positionToGeoLibCoordinates(otherPosition),
      accuracy
    )
  );
}

export function heading2D(position: Position, otherPosition: Position) {
  if (position === otherPosition) {
    return degrees(0);
  }

  return degrees(
    getRhumbLineBearing(
      positionToGeoLibCoordinates(position),
      positionToGeoLibCoordinates(otherPosition)
    )
  );
}

export function translatePosition(
  position: Position,
  distance: Quantity<Length>,
  heading: Quantity<Angle>
) {
  let point = computeDestinationPoint(
    positionToGeoLibCoordinates(position),
    distance.convertTo(meters).value,
    heading.convertTo(degrees).value
  );

  return new Position(
    degrees(point.latitude),
    degrees(point.longitude),
    position.altitude
  );
}
