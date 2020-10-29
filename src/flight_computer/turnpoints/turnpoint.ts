import Position from 'flight_computer/position';
import { TaskTurnpoint } from 'flight_computer/task';
import Quantity from 'units/quantity';
import { Angle } from 'units/angle';

export interface TurnpointSegment {
  isCrossing(lastPosition: Position, position: Position): boolean;
  rotate(angle: Quantity<Angle>): void;
}

export default class Turnpoint implements TaskTurnpoint {
  name: string;
  parts: TurnpointSegment[];

  constructor(name: string, parts: TurnpointSegment[]) {
    this.name = name;
    this.parts = parts;
  }

  isCrossing(lastPosition: Position, position: Position) {
    return !!this.parts.find(p => p.isCrossing(lastPosition, position));
  }
}
