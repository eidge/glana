import Fix from './flight_computer/fix';
import FlightComputer, { Datum } from './flight_computer/computer';

export default class SavedFlight {
  fixes: Fix[];
  datums: Datum[] = [];

  constructor(fixes: Fix[]) {
    this.fixes = fixes;
  }

  analise(computer = new FlightComputer()) {
    if (this.wasAlreadyAnalysed()) return this;

    this.fixes.forEach(fix => {
      computer.update(fix);
      this.datums.push(computer.currentDatum!);
    });

    return this;
  }

  private wasAlreadyAnalysed() {
    return this.datums.length > 0;
  }
}
