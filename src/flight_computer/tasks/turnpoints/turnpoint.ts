import Position from '../../position';
import { TaskTurnpoint } from '../task';
import Quantity from '../../../units/quantity';
import { Angle, degrees } from '../../../units/angle';
import { unionGeoJSON } from '../../../math/geo';
import { isEqual } from 'lodash';

export interface TurnpointSegment {
  center: Position;
  isCrossing(lastPosition: Position, position: Position): boolean;
  rotate(angle: Quantity<Angle>): void;
  toGeoJSON(): any;
}

export default class Turnpoint implements TaskTurnpoint {
  readonly name: string;
  readonly parts: TurnpointSegment[];
  readonly center: Position;
  rotationAngle: Quantity<Angle> = degrees(0);

  constructor(name: string, parts: TurnpointSegment[]) {
    this.name = name;
    this.parts = parts;
    this.center = parts[0].center;
  }

  rotate(degrees: Quantity<Angle>) {
    this.rotationAngle = degrees.normalise();
    this.parts.forEach(p => p.rotate(degrees));
  }

  isCrossing(lastPosition: Position, position: Position) {
    return !!this.parts.find(p => p.isCrossing(lastPosition, position));
  }

  toGeoJSON() {
    let geoJSON = this.parts[0].toGeoJSON();
    this.parts
      .slice(1)
      .forEach(p => (geoJSON = unionGeoJSON(geoJSON, p.toGeoJSON())));
    return geoJSON;
  }

  isEqual(tp: Turnpoint) {
    const selfGeo = this.toGeoJSON();
    const otherGeo = tp.toGeoJSON();

    return isEqual(selfGeo, otherGeo);
  }
}
