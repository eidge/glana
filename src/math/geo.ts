import Position from '../flight_computer/position';
import { degrees, Angle } from '../units/angle';
import { meters, Length, kilometers } from '../units/length';
import {
  point,
  rhumbDistance,
  rhumbBearing,
  transformTranslate,
} from '@turf/turf';
import Quantity from 'units/quantity';

function positionToTurfPoint(position: Position) {
  return point([
    position.longitude.convertTo(degrees).value,
    position.latitude.convertTo(degrees).value,
  ]);
}

export function distance2D(position: Position, otherPosition: Position) {
  if (position === otherPosition) {
    return meters(0);
  }

  return meters(
    rhumbDistance(
      positionToTurfPoint(position),
      positionToTurfPoint(otherPosition),
      { units: 'kilometers' }
    ) * 1000
  );
}

export function heading2D(position: Position, otherPosition: Position) {
  if (position === otherPosition) {
    return degrees(0);
  }

  let bearing = rhumbBearing(
    positionToTurfPoint(position),
    positionToTurfPoint(otherPosition),
    { final: false }
  );

  if (bearing < 0) {
    bearing += 360;
  }

  return degrees(bearing);
}

export function translatePosition(
  position: Position,
  distance: Quantity<Length>,
  heading: Quantity<Angle>
) {
  let point = transformTranslate(
    positionToTurfPoint(position),
    distance.convertTo(kilometers).value,
    heading.convertTo(degrees).value,
    { units: 'kilometers', mutate: true }
  );

  return new Position(
    degrees(point.geometry!.coordinates[1]),
    degrees(point.geometry!.coordinates[0]),
    position.altitude
  );
}
