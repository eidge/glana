import { GliderState } from '../../flight_computer/state_machine';
import { seconds, milliseconds } from '../../units/duration';
import SavedFlight from '../../saved_flight';

export default abstract class Phase {
  startIdx: number;
  endIdx: number;

  protected flight: SavedFlight;

  abstract type: GliderState;

  constructor(flight: SavedFlight, startIdx: number, endIdx: number) {
    this.flight = flight;
    this.startIdx = startIdx;
    this.endIdx = endIdx;
  }

  get startAt() {
    return this.firstDatum.timestamp;
  }

  get finishAt() {
    return this.lastDatum.timestamp;
  }

  get firstDatum() {
    return this.flight.datums[this.startIdx];
  }

  get lastDatum() {
    return this.flight.datums[this.endIdx];
  }

  get duration() {
    let millis = this.finishAt.getTime() - this.startAt.getTime();
    return milliseconds(millis).convertTo(seconds);
  }

  protected get datums() {
    return this.flight.datums.slice(this.startIdx, this.endIdx + 1);
  }
}
