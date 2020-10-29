import Fix from './flight_computer/fix';
import FlightComputer, { Datum } from './flight_computer/computer';
import Analysis from './analysis';
import Phase from './analysis/phase';
import { Duration, milliseconds } from './units/duration';
import Quantity from './units/quantity';
import Task from './flight_computer/tasks/task';

export default class SavedFlight {
  readonly fixes: Fix[];
  readonly task: Task | null;

  private datums: Datum[] = [];
  private phases: Phase[] = [];
  private timeOffsetInMilliseconds: number;
  private analysed: boolean;

  constructor(fixes: Fix[], task: Task | null = null) {
    this.fixes = fixes;
    this.analysed = false;
    this.timeOffsetInMilliseconds = 0;
    this.task = task;
  }

  analise(computer = new FlightComputer()) {
    let analysis = this.performAnalysis(computer);
    this.datums = analysis.getDatums();
    this.phases = analysis.getPhases();
    this.analysed = true;
    return this;
  }

  private performAnalysis(computer: FlightComputer) {
    let analysis = new Analysis(this.fixes, computer);
    analysis.perform();
    return analysis;
  }

  setTimeOffset(offset: Quantity<Duration>) {
    this.ensureAnalysisIsDone();

    let newOffset = offset.convertTo(milliseconds).value;
    let offsetDelta = newOffset - this.timeOffsetInMilliseconds;
    this.timeOffsetInMilliseconds = newOffset;

    if (offsetDelta === 0) {
      return;
    }

    this.datums = this.datums.map(d => this.offsetDatumTime(d, offsetDelta));
    this.phases = this.phases.map(p => this.offsetPhase(p, offsetDelta));
  }

  private ensureAnalysisIsDone() {
    if (!this.analysed) {
      this.analise();
    }
  }

  private offsetDatumTime(datum: Datum, offsetInMillisecods: number) {
    datum = Object.assign({}, datum);
    datum.timestamp = this.offsetDate(datum.timestamp, offsetInMillisecods);
    return datum;
  }

  private offsetPhase(phase: Phase, offsetInMillisecods: number) {
    phase = Object.assign({}, phase);
    phase.startAt = this.offsetDate(phase.startAt, offsetInMillisecods);
    phase.finishAt = this.offsetDate(phase.finishAt, offsetInMillisecods);
    return phase;
  }

  private offsetDate(date: Date, offsetInMillisecods: number) {
    return new Date(date.getTime() + offsetInMillisecods);
  }

  getDatums() {
    this.ensureAnalysisIsDone();
    return this.datums;
  }

  getPhases() {
    this.ensureAnalysisIsDone();
    return this.phases;
  }

  getRecordingStartedAt() {
    return this.getDatums()[0].timestamp;
  }

  getTakeoffAt() {
    let firstFlightPhase =
      this.getPhases().find(p => p.type !== 'stopped') || null;
    return firstFlightPhase && firstFlightPhase.startAt;
  }

  getLandedAt() {
    if (!this.getTakeoffAt()) return null;

    let lastStopPhase =
      this.getPhases()
        .reverse()
        .find(p => p.type === 'stopped') || null;

    if (!lastStopPhase || this.getPhases().indexOf(lastStopPhase) === 0) {
      return null;
    }

    return lastStopPhase.startAt;
  }

  getRecordingStoppedAt() {
    let datums = this.getDatums();
    return datums[datums.length - 1].timestamp;
  }

  phaseAt(timestamp: Date) {
    return (
      this.getPhases().find(
        phase =>
          phase.startAt.getTime() <= timestamp.getTime() &&
          phase.finishAt.getTime() > timestamp.getTime()
      ) || null
    );
  }

  datumAt(timestamp: Date) {
    // FIXME: This should defo be binary search
    return (
      this.getDatums().find(
        datum => datum.timestamp.getTime() > timestamp.getTime()
      ) || null
    );
  }
}
