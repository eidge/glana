import Fix from './flight_computer/fix';
import FlightComputer, { Datum } from './flight_computer/computer';
import Analysis from './analysis';
import Phase from './analysis/phase';
import { Duration, milliseconds } from './units/duration';
import Quantity from './units/quantity';
import Task, { TaskTurnpoint } from './flight_computer/tasks/task';

interface Metadata {
  pilotName?: string | null;
  registration?: string | null;
  callsign?: string | null;
}

export default class SavedFlight {
  readonly fixes: Fix[];
  readonly metadata: Metadata;

  id: string;
  task: Task | null;

  private datums: Datum[] = [];
  private phases: Phase[] = [];
  private timeOffsetInMilliseconds: number;
  private analysed: boolean;

  constructor(fixes: Fix[], task: Task | null = null, metadata: Metadata = {}) {
    this.id = Math.random()
      .toString()
      .slice(2, 8);
    this.fixes = fixes;
    this.analysed = false;
    this.timeOffsetInMilliseconds = 0;
    this.task = task;
    this.metadata = metadata;
  }

  analise(computer = new FlightComputer()) {
    if (this.task) {
      computer.setTask(this.task);
    }

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

  getTimeOffsetInMilliseconds() {
    return milliseconds(this.timeOffsetInMilliseconds);
  }

  setTimeOffset(offset: Quantity<Duration>) {
    let newOffset = offset.convertTo(milliseconds).value;
    let offsetDelta = newOffset - this.timeOffsetInMilliseconds;
    this.timeOffsetInMilliseconds = newOffset;

    if (offsetDelta === 0) {
      return;
    }

    this.ensureAnalysisIsDone();
    this.datums = this.datums.map(d => this.offsetDatumTime(d, offsetDelta));
    this.phases = this.phases.map(p => this.offsetPhase(p, offsetDelta));
  }

  private ensureAnalysisIsDone() {
    if (!this.analysed) {
      throw new Error('Flight has not been analysed yet.');
    }
  }

  private offsetDatumTime(datum: Datum, offsetInMillisecods: number) {
    datum = Object.create(datum);
    datum.timestamp = this.offsetDate(datum.timestamp, offsetInMillisecods);
    return datum;
  }

  private offsetPhase(phase: Phase, offsetInMillisecods: number) {
    phase = Object.create(phase);
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

  getRecordingStartedAt(realTime = false) {
    return this.maybeReturnRealTime(this.getDatums()[0].timestamp, realTime);
  }

  private maybeReturnRealTime(date: Date, realTime: boolean) {
    if (realTime) {
      return this.offsetDate(date, -this.timeOffsetInMilliseconds);
    } else {
      return date;
    }
  }

  getTakeoffAt(realTime = false) {
    let firstFlightPhase =
      this.getPhases().find(p => p.type !== 'stopped') || null;
    return (
      firstFlightPhase &&
      this.maybeReturnRealTime(firstFlightPhase.startAt, realTime)
    );
  }

  getTaskStartedAt(realTime = false) {
    if (!this.task) return null;
    return this.getTurnpointReachedAt(this.task.turnpoints[0], realTime);
  }

  getTurnpointReachedAt(tp: TaskTurnpoint, realTime = false) {
    if (!this.task) return null;
    let reachedAt = this.task.getTurnpointReachedAt(tp);

    if (!reachedAt) return null;

    if (realTime) {
      return reachedAt;
    } else {
      return this.offsetDate(reachedAt, this.timeOffsetInMilliseconds);
    }
  }

  getLandedAt(realTime = false) {
    if (!this.getTakeoffAt()) return null;

    const phases = this.getPhases().slice();
    const lastStopPhase =
      phases.reverse().find(p => p.type === 'stopped') || null;

    if (!lastStopPhase || this.getPhases().indexOf(lastStopPhase) === 0) {
      return this.getRecordingStoppedAt(realTime);
    }

    return this.maybeReturnRealTime(lastStopPhase.startAt, realTime);
  }

  getRecordingStoppedAt(realTime = false) {
    let datums = this.getDatums();
    return this.maybeReturnRealTime(
      datums[datums.length - 1].timestamp,
      realTime
    );
  }

  getDuration() {
    const startTime = this.getTakeoffAt()?.getTime();
    let finishTime = this.getLandedAt()?.getTime();

    if (!startTime) {
      return milliseconds(0);
    }

    if (!finishTime) {
      finishTime = this.getRecordingStoppedAt().getTime();
    }

    return milliseconds(finishTime - startTime);
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
    const index = this.datumIndexAt(timestamp);
    if (index === null) return null;
    return this.getDatums()[index];
  }

  datumIndexAt(timestamp: Date) {
    const datums = this.getDatums();

    if (
      timestamp < datums[0].timestamp ||
      timestamp > datums[datums.length - 1].timestamp
    ) {
      return null;
    }

    let start = 0;
    let end = datums.length - 1;
    let middle = Math.floor(end / 2);

    let iteration = 0;
    while (start !== end) {
      if (iteration++ > 1000) {
        throw new Error('datums are not ordered');
      }

      if (
        middle === datums.length - 1 ||
        (timestamp >= datums[middle].timestamp &&
          timestamp < datums[middle + 1].timestamp)
      ) {
        break;
      }

      if (timestamp >= datums[middle].timestamp) {
        start = middle;
        middle = Math.floor((end + start) / 2);
        if (start === middle) {
          ++middle;
        }
      } else {
        end = middle;
        middle = Math.floor((end + start) / 2);
      }
    }

    return middle;
  }
}
