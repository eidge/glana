import Position from '../position';
import { Angle, degrees } from '../../units/angle';
import Quantity from '../../units/quantity';
import { Length, meters } from '../../units/length';
import { Datum } from '../computer';
import { milliseconds } from '../../units/duration';
import { Speed } from '../../units/speed';

export interface TaskTurnpoint {
  name: string;
  center: Position;
  rotationAngle: Quantity<Angle>;
  isCrossing(lastPosition: Position, position: Position): boolean;
  rotate(angle: Quantity<Angle>): void;
  toGeoJSON(): any;
  isEqual(tp: TaskTurnpoint): boolean;
}

export default class Task {
  readonly turnpoints: TaskTurnpoint[];
  readonly distance: Quantity<Length>;
  readonly name: string;

  private lastDatum: Datum | null = null;
  private nextTurnpointIndex: number = 0;
  private reachedTurnpointsAt: WeakMap<TaskTurnpoint, Date> = new WeakMap();

  constructor(turnpoints: TaskTurnpoint[]) {
    this.turnpoints = this.rotateTurnpoints(turnpoints);
    this.distance = this.calculateDistance(turnpoints);
    this.name = this.defaultTaskName(turnpoints);
  }

  private defaultTaskName(turnpoints: TaskTurnpoint[]) {
    return turnpoints.map(tp => tp.name).join('-');
  }

  update(datum: Datum) {
    if (!this.lastDatum || !this.getNextTurnpoint()) {
      this.lastDatum = datum;
      return;
    }

    let nextTp = this.getNextTurnpoint();
    if (this.shouldResetStartTime(datum)) {
      this.markTurnpointAsReached(0, datum);
    } else if (nextTp.isCrossing(this.lastDatum!.position, datum.position)) {
      this.markTurnpointAsReached(this.nextTurnpointIndex, datum);
    }

    this.lastDatum = datum;
  }

  getNextTurnpoint() {
    return this.turnpoints[this.nextTurnpointIndex] || null;
  }

  isStarted() {
    return this.nextTurnpointIndex !== 0;
  }

  isFinished() {
    return this.nextTurnpointIndex === this.turnpoints.length;
  }

  getDistance() {
    return this.distance;
  }

  getDuration() {
    if (!this.isFinished()) return null;
    return milliseconds(
      this.finishedAt()!.getTime() - this.startedAt()!.getTime()
    );
  }

  getSpeed() {
    const duration = this.getDuration();
    if (!duration) return null;
    return Speed.create(this.distance, duration);
  }

  isEqual(task: Task) {
    return this.turnpoints.every((tp, i) => tp.isEqual(task.turnpoints[i]));
  }

  getTurnpointsReachedAt(): Date[] {
    return this.turnpoints
      .map(tp => this.getTurnpointReachedAt(tp))
      .filter(time => !!time) as Date[];
  }

  private startedAt() {
    return this.getTurnpointReachedAt(this.turnpoints[0]);
  }

  private finishedAt() {
    return this.getTurnpointReachedAt(
      this.turnpoints[this.turnpoints.length - 1]
    );
  }

  private shouldResetStartTime(datum: Datum) {
    return (
      this.nextTurnpointIndex === 1 &&
      this.isCrossing(this.turnpoints[0], datum)
    );
  }

  private isCrossing(turnpoint: TaskTurnpoint, datum: Datum) {
    if (!this.lastDatum) return false;
    return turnpoint.isCrossing(this.lastDatum.position, datum.position);
  }

  private markTurnpointAsReached(turnpointIndex: number, datum: Datum) {
    this.reachedTurnpointsAt.set(
      this.turnpoints[turnpointIndex],
      datum.timestamp
    );
    this.nextTurnpointIndex = turnpointIndex + 1;
  }

  getTurnpointReachedAt(turnpoint: TaskTurnpoint) {
    return this.reachedTurnpointsAt.get(turnpoint) || null;
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
    let heading = tp.center.heading2DTo(nextTp.center).add(degrees(180));
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
    let heading = inboundHeading.add(outboundHeading).divide(2);

    if (inboundHeading.greaterThan(outboundHeading)) {
      heading = heading.add(degrees(90));
    } else {
      heading = heading.subtract(degrees(90));
    }

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
