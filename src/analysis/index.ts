import FlightComputer, { Datum } from '../flight_computer/computer';
import Phase from './phases/phase';
import SavedFlight from '../saved_flight';
import * as phases from './phases';

export default class Analysis {
  private computer: FlightComputer;

  constructor(computer = new FlightComputer()) {
    this.computer = computer;
  }

  perform(flight: SavedFlight) {
    const datums = this.buildDatums(flight);
    flight.datums = datums;
    flight.phases = this.detectPhases(flight, datums);
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

  private detectPhases(flight: SavedFlight, datums: Datum[]): Phase[] {
    let phases = this.buildPhases(flight, datums);
    return phases;
  }

  private buildPhases(flight: SavedFlight, datums: Datum[]) {
    let phases: Phase[] = [];
    let startDatumIdx = 0;

    datums.forEach((datum, endDatumIdx) => {
      if (datums[startDatumIdx].state !== datum.state) {
        let phase = this.buildPhase(
          flight,
          datums,
          startDatumIdx,
          endDatumIdx - 1
        );
        phases.push(phase);
        startDatumIdx = endDatumIdx;
      }
    });

    if (startDatumIdx !== datums.length - 1) {
      // Last phase will not have a datum with a different state, therefore we
      // need to handle it differently.
      let finalPhase = this.buildPhase(
        flight,
        datums,
        startDatumIdx,
        datums.length - 1
      );
      phases.push(finalPhase);
    }

    return phases;
  }

  private buildPhase(
    flight: SavedFlight,
    datums: Datum[],
    startIndex: number,
    endIndex: number
  ) {
    return phases.build(datums[startIndex].state, flight, startIndex, endIndex);
  }
}
