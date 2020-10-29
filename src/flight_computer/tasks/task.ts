import Position from '../position';
import { Angle, degrees } from '../../units/angle';
import Quantity from '../../units/quantity';
import { Length, meters } from '../../units/length';

export interface TaskTurnpoint {
  name: string;
  center: Position;
  rotationAngle: Quantity<Angle>;
  isCrossing(lastPosition: Position, position: Position): boolean;
  rotate(angle: Quantity<Angle>): void;
}

export default class Task {
  readonly turnpoints: TaskTurnpoint[];
  readonly distance: Quantity<Length>;

  constructor(turnpoints: TaskTurnpoint[]) {
    this.turnpoints = this.rotateTurnpoints(turnpoints);
    this.distance = this.calculateDistance(turnpoints);
  }

  private rotateTurnpoints(turnpoints: TaskTurnpoint[]) {
    if (turnpoints.length < 2) {
      return turnpoints;
    }

    turnpoints.forEach((tp, index) => {
      if (index === 0) {
        this.rotateStartTurnpoint(tp, turnpoints[1]);
      } else if (index === turnpoints.length - 1) {
        this.rotateFinishTurnpoint(turnpoints[index - 1], tp);
      } else {
        this.rotateMiddleTurnpoint(
          turnpoints[index - 1],
          tp,
          turnpoints[index + 1]
        );
      }
    });

    return turnpoints;
  }

  private rotateStartTurnpoint(tp: TaskTurnpoint, nextTp: TaskTurnpoint) {
    let heading = tp.center.heading2DTo(nextTp.center);
    tp.rotate(heading);
  }

  private rotateFinishTurnpoint(previousTp: TaskTurnpoint, tp: TaskTurnpoint) {
    let heading = previousTp.center.heading2DTo(tp.center);
    tp.rotate(heading);
  }

  private rotateMiddleTurnpoint(
    previousTp: TaskTurnpoint,
    tp: TaskTurnpoint,
    nextTp: TaskTurnpoint
  ) {
    let inboundHeading = previousTp.center.heading2DTo(tp.center);
    let outboundHeading = tp.center.heading2DTo(nextTp.center);
    let heading = inboundHeading
      .add(outboundHeading)
      .divide(2)
      .subtract(degrees(90));
    tp.rotate(heading);
  }

  private calculateDistance(turnpoints: TaskTurnpoint[]) {
    // TODO: Does not take into account turnpoint size yet!
    if (turnpoints.length < 2) {
      return meters(0);
    }
    let previousTp = turnpoints[0];
    let distance = meters(0);
    turnpoints.slice(1, turnpoints.length).forEach(tp => {
      let legDistance = previousTp.center.distance2DTo(tp.center);
      distance = distance.add(legDistance);
      previousTp = tp;
    });
    return distance;
  }
}
