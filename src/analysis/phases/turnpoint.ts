import Phase from './phase';
import { PhaseType } from '.';
import { TaskTurnpoint } from '../../flight_computer/tasks/task';
import { meters } from '../../units/length';

export default class Turnpoint extends Phase {
  type: PhaseType = 'turnpoint';

  private get task() {
    return this.flight.task!;
  }

  get turnpointIndex(): number {
    const turnpointDatum = this.flight.datums[this.endIndex];
    const turnpointsReachedAt = this.task.getTurnpointsReachedAt();
    return turnpointsReachedAt.indexOf(turnpointDatum.timestamp);
  }

  get turnpoint(): TaskTurnpoint {
    return this.task.turnpoints[this.turnpointIndex];
  }

  isFirstTurnpoint() {
    return this.turnpointIndex === 0;
  }

  isLastTurnpoint() {
    return this.turnpointIndex === this.task.turnpoints.length - 1;
  }

  get distanceToNext() {
    const nextTurnpoint = this.task.turnpoints[this.turnpointIndex + 1];
    if (!nextTurnpoint) return meters(0);
    return this.turnpoint.center.distance2DTo(nextTurnpoint.center);
  }
}
