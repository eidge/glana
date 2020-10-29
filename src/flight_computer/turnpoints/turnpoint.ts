import Position from 'flight_computer/position';
import { TaskTurnpoint } from 'flight_computer/task';
import Quantity from 'units/quantity';
import { Angle, degrees } from 'units/angle';

export interface TurnpointSegment {
  center: Position;
  isCrossing(lastPosition: Position, position: Position): boolean;
  rotate(angle: Quantity<Angle>): void;
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
}
