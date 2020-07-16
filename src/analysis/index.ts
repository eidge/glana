import FlightComputer, { Datum } from '../flight_computer/computer';
import Fix from '../flight_computer/fix';
import Phase from './phase';

export default class Analysis {
  private computer: FlightComputer;
  private fixes: Fix[];
  private datums: Datum[] | null = null;
  private phases: Phase[] = [];

  constructor(fixes: Fix[], computer = new FlightComputer()) {
    this.computer = computer;
    this.fixes = fixes;
  }

  isDone() {
    return this.datums !== null;
  }

  perform() {
    if (this.isDone()) return this;
    this.datums = this.buildDatums();
    this.phases = this.buildPhases(this.datums);
    return this;
  }

  private buildDatums() {
    let datums: Datum[] = [];
    this.fixes.forEach(fix => {
      this.computer.update(fix);
      datums.push(this.computer.currentDatum!);
    });
    return datums;
  }

  private buildPhases(datums: Datum[]): Phase[] {
    let phases: Phase[] = [];
    let startDatumIdx = 0;

    datums.forEach((datum, endDatumIdx) => {
      if (datums[startDatumIdx].state !== datum.state) {
        let phase = this.buildPhase(datums, startDatumIdx, endDatumIdx);
        phases.push(phase);
        startDatumIdx = endDatumIdx;
      }
    });

    if (startDatumIdx !== datums.length - 1) {
      // Last phase will not have a datum with a different state, therefore we
      // need to handle it differently.
      let finalPhase = this.buildPhase(
        datums,
        startDatumIdx,
        datums.length - 1
      );
      phases.push(finalPhase);
    }

    return phases;
  }

  private buildPhase(datums: Datum[], startIdx: number, endIdx: number) {
    return new Phase(
      datums[startIdx].updatedAt,
      datums[endIdx].updatedAt,
      datums[startIdx].state
    );
  }

  getDatums(): Datum[] {
    if (!this.isDone()) this.perform();
    return this.datums!;
  }

  getPhases(): Phase[] {
    if (!this.isDone()) this.perform();
    return this.phases;
  }
}
