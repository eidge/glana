import { seconds, milliseconds } from '../../units/duration';
import SavedFlight from '../../saved_flight';
import { PhaseType } from '.';

export default abstract class Phase {
  startIndex: number;
  endIndex: number;

  protected flight: SavedFlight;

  abstract type: PhaseType;

  constructor(flight: SavedFlight, startIndex: number, endIndex: number) {
    this.flight = flight;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  isEqual(otherPhase: Phase) {
    return (
      this.flight === otherPhase.flight &&
      this.startIndex === otherPhase.startIndex &&
      this.endIndex === otherPhase.endIndex
    );
  }

  get startAt() {
    return this.firstDatum.timestamp;
  }

  get finishAt() {
    return this.lastDatum.timestamp;
  }

  get firstDatum() {
    return this.flight.datums[this.startIndex];
  }

  get lastDatum() {
    return this.flight.datums[this.endIndex];
  }

  get duration() {
    let millis = this.finishAt.getTime() - this.startAt.getTime();
    return milliseconds(millis).convertTo(seconds);
  }

  protected get datums() {
    return this.flight.datums.slice(this.startIndex, this.endIndex + 1);
  }

  splitAtIndex(idx: number): [Phase | null, Phase | null] {
    if (idx <= this.startIndex) return [null, this];
    if (idx >= this.endIndex) return [this, null];

    const p1 = Object.create(this);
    const p2 = Object.create(this);

    p1.startIndex = this.startIndex;
    p1.endIndex = idx - 1;

    p2.startIndex = idx;
    p2.endIndex = this.endIndex;

    return [p1, p2];
  }
}
