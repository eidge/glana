import Fix from 'flight_computer/fix';

export default class SavedFlight {
  fixes: Fix[];

  constructor(fixes: Fix[]) {
    this.fixes = fixes;
  }
}
