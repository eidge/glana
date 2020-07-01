import IGCParser from 'igc-parser';
import Fix from '../flight_computer/fix';
import SavedFlight from '../saved_flight';

class Parser {
  parse(igc_contents: string) {
    let parsedIGC = IGCParser.parse(igc_contents);
    let fixes = parsedIGC.fixes.map(this.buildFix);
    return new SavedFlight(fixes);
  }

  private buildFix(brecord: IGCParser.BRecord) {
    return new Fix(
      new Date(brecord.timestamp),
      brecord.latitude,
      brecord.longitude,
      brecord.gpsAltitude || 0,
      brecord.pressureAltitude
    );
  }
}

export default Parser;
