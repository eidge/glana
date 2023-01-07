import FlightComputer, { Datum } from '../flight_computer/computer';
import Phase from './phases/phase';
import SavedFlight from '../saved_flight';
import * as phases from './phases';
import { PhaseType } from './phases';
import TaskStats from './task_stats';

export default class Analysis {
  private computer: FlightComputer;

  constructor(computer = new FlightComputer()) {
    this.computer = computer;
  }

  perform(flight: SavedFlight) {
    if (flight.task) {
      this.computer.setTask(flight.task);
    }

    const datums = this.buildDatums(flight);
    flight.datums = datums;
    flight.phases = this.buildPhases(flight, datums);
    flight.taskStats = flight.task && new TaskStats(flight.task, flight.phases);

    return this;
  }

  private buildDatums(flight: SavedFlight) {
    let datums: Datum[] = [];
    flight.fixes.forEach(fix => {
      this.computer.update(fix);
      datums.push(this.computer.currentDatum!);
    });
    return datums;
  }

  private buildPhases(flight: SavedFlight, datums: Datum[]) {
    let phases: Phase[] = [];
    let startDatumIdx = 0;

    const turnpointsAt = flight.task?.getTurnpointsReachedAt() || [];

    for (let endDatumIdx = 0; endDatumIdx < datums.length; ++endDatumIdx) {
      const startDatum = datums[startDatumIdx];
      const endDatum = datums[endDatumIdx];
      const previousEndDatum = datums[endDatumIdx - 1] || null;
      const nextEndDatum = datums[endDatumIdx + 1] || null;

      const flightPhaseChanged = startDatum.state !== endDatum.state;
      const willRoundTurnpoint = this.isRoundingTurnpoint(
        nextEndDatum,
        turnpointsAt
      );
      const justRoundedTurnpoint = this.isRoundingTurnpoint(
        previousEndDatum,
        turnpointsAt
      );

      if (flightPhaseChanged || justRoundedTurnpoint || willRoundTurnpoint) {
        const phaseType = justRoundedTurnpoint ? 'turnpoint' : startDatum.state;
        const phase = this.buildPhase(
          flight,
          phaseType,
          startDatumIdx,
          endDatumIdx - 1
        );
        phases.push(phase);
        startDatumIdx = endDatumIdx;
      }
    }

    if (startDatumIdx < datums.length - 1) {
      // Last phase will not have a datum with a different state, therefore we
      // need to handle it differently.
      const startDatum = datums[startDatumIdx];
      const endDatum = datums[datums.length - 1];
      const phaseType = this.isRoundingTurnpoint(endDatum, turnpointsAt)
        ? 'turnpoint'
        : startDatum.state;

      const finalPhase = this.buildPhase(
        flight,
        phaseType,
        startDatumIdx,
        datums.length - 1
      );
      phases.push(finalPhase);
    }

    return phases;
  }

  private isRoundingTurnpoint(datum: Datum | null, turnpointsAt: Date[]) {
    if (!datum) return false;
    return turnpointsAt.indexOf(datum.timestamp) !== -1;
  }

  private buildPhase(
    flight: SavedFlight,
    phaseType: PhaseType,
    startIndex: number,
    endIndex: number
  ) {
    return phases.build(phaseType, flight, startIndex, endIndex);
  }
}
