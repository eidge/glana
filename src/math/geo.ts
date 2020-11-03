import Position from '../flight_computer/position';
import { degrees, Angle } from '../units/angle';
import { meters, Length, kilometers } from '../units/length';
import {
  point,
  rhumbDistance,
  rhumbBearing,
  transformTranslate,
  lineString,
  lineIntersect,
  circle,
  sector,
  union,
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

export function intersectsLine(
  line1: [Position, Position],
  line2: [Position, Position]
) {
  let turfLine1 = lineString([
    [line1[0].longitude.value, line1[0].latitude.value],
    [line1[1].longitude.value, line1[1].latitude.value],
  ]);
  let turfLine2 = lineString([
    [line2[0].longitude.value, line2[0].latitude.value],
    [line2[1].longitude.value, line2[1].latitude.value],
  ]);
  return lineIntersect(turfLine1, turfLine2).features.length > 0;
}

export function circleGeoJSON(
  center: Position,
  radius: Quantity<Length>,
  steps: number = 64
) {
  return circle(
    positionToTurfPoint(center),
    radius.convertTo(kilometers).value,
    { steps, units: 'kilometers' }
  );
}

export function lineGeoJSON(...positions: Position[]) {
  let points = positions.map(p => positionToTurfPoint(p).geometry!.coordinates);
  return lineString(points);
}

export function sectorGeoJSON(
  center: Position,
  radius: Quantity<Length>,
  startBearing: Quantity<Angle>,
  endBearing: Quantity<Angle>,
  steps: number = 64
) {
  return sector(
    positionToTurfPoint(center),
    radius.convertTo(kilometers).value,
    startBearing.convertTo(degrees).value,
    endBearing.convertTo(degrees).value,
    { steps }
  );
}

export function unionGeoJSON(...geo: any[]) {
  return union(...geo);
}
