import { GliderState } from '../flight_computer/state_machine';
import { seconds, milliseconds } from '../units/duration';

export default class Phase {
  startAt: Date;
  finishAt: Date;
  type: GliderState;

  constructor(startAt: Date, finishAt: Date, type: GliderState) {
    this.startAt = startAt;
    this.finishAt = finishAt;
    this.type = type;
  }

  getDuration() {
    let millis = this.finishAt.getTime() - this.startAt.getTime();
    return milliseconds(millis).convertTo(seconds);
  }
}
