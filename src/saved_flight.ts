import Fix from './flight_computer/fix';
import FlightComputer, { Datum } from './flight_computer/computer';
import Analysis from './analysis';
import Phase from './analysis/phase';

export default class SavedFlight {
  fixes: Fix[];
  datums: Datum[] = [];
  phases: Phase[] = [];

  constructor(fixes: Fix[]) {
    this.fixes = fixes;
  }

  analise(computer = new FlightComputer()) {
    let analysis = this.performAnalysis(computer);
    this.datums = analysis.getDatums();
    this.phases = analysis.getPhases();
    return this;
  }

  phaseAt(timestamp: Date) {
    return this.phases.find(
      phase =>
        phase.startAt.getTime() <= timestamp.getTime() &&
        phase.finishAt.getTime() > timestamp.getTime()
    );
  }

  private performAnalysis(computer: FlightComputer) {
    let analysis = new Analysis(this.fixes, computer);
    analysis.perform();
    return analysis;
  }
}
