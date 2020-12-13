import FlightComputer, { Datum } from '../flight_computer/computer';
import Fix from '../flight_computer/fix';
import Phase from './phase';
import { seconds } from '../units/duration';

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
    this.phases = this.detectPhases(this.datums);
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

  private detectPhases(datums: Datum[]): Phase[] {
    let phases = this.buildPhases(datums);
    return this.filterOutNoisyPhases(phases);
  }

  private buildPhases(datums: Datum[]) {
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

  private filterOutNoisyPhases(phases: Phase[]): Phase[] {
    // This is buggy:
    //   - Given three phases: [gliding, thermal, gliding]
    //   - If the thermal is filtered out we get: [gliding, gliding]
    //   - What we should get instead is: [gliding]
    let filteredPhases: Phase[] = [];
    phases.forEach((phase, idx) => {
      if (
        phase.getDuration().greaterThan(seconds(30)) ||
        phase.type === 'stopped'
      ) {
        filteredPhases.push(phase);
        return;
      }

      const nextPhase = phases[idx + 1];
      if (nextPhase) {
        nextPhase.startAt = phase.startAt;
      }
    });

    return filteredPhases;
  }

  private buildPhase(datums: Datum[], startIdx: number, endIdx: number) {
    return new Phase(
      datums[startIdx].timestamp,
      datums[endIdx].timestamp,
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
