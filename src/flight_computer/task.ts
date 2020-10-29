import Position from './position';

export interface TaskTurnpoint {
  name: string;
  isCrossing(lastPosition: Position, position: Position): boolean;
  // rotate(angle: Quantity<Angle>)
}

export default class Task {
  turnpoints: TaskTurnpoint[];

  constructor(turnpoints: TaskTurnpoint[]) {
    this.turnpoints = turnpoints;
    // Rotate turnpoints accordingly
  }
}
