import IGCParser from 'glana-igc-parser';
import Fix, { FixExtras } from '../flight_computer/fix';
import SavedFlight from '../saved_flight';
import Factory from '../flight_computer/tasks/turnpoints/factories/factory';
import bgaFactory from '../flight_computer/tasks/turnpoints/factories/bga_factory';
import Position from '../flight_computer/position';
import { degrees } from '../units/angle';
import { meters } from '../units/length';
import Task from '../flight_computer/tasks/task';

class Parser {
  parse(igcContents: string, turnpointFactory: Factory = bgaFactory) {
    let parsedIGC = IGCParser.parse(igcContents, { lenient: true });
    let fixes = this.parseFixes(parsedIGC);
    let task = this.parseTask(parsedIGC.task, turnpointFactory);
    return new SavedFlight(fixes, task, {
      registration: parsedIGC.registration,
      callsign: parsedIGC.callsign,
      pilotName: parsedIGC.pilot,
    });
  }

  private parseFixes(parsedIGC: IGCParser.IGCFile) {
    let parsedFixes: Fix[] = [];
    parsedIGC.fixes.forEach(brecord => {
      let parsedFix = this.buildFix(brecord);
      if (parsedFix) {
        parsedFixes.push(parsedFix);
      }
    });
    return parsedFixes;
  }

  private parseTask(task: IGCParser.Task | null, turnpointFactory: Factory) {
    if (!task) return null;

    let points = task.points.filter(p => p.latitude !== 0 && p.longitude !== 0);

    let turnpoints = points.map((point, index) => {
      let tpPosition = this.taskPointToPosition(point);
      let tpName = point.name || `TP${index + 1}`;

      if (index === 0) {
        return turnpointFactory.start(tpName, tpPosition);
      } else if (index === points.length - 1) {
        return turnpointFactory.finish(tpName, tpPosition);
      } else {
        return turnpointFactory.turnpoint(tpName, tpPosition);
      }
    });

    return new Task(turnpoints);
  }

  private taskPointToPosition(point: IGCParser.TaskPoint) {
    return new Position(
      degrees(point.latitude),
      degrees(point.longitude),
      meters(0)
    );
  }

  private buildFix(brecord: IGCParser.BRecord) {
    if (!brecord.valid) return null;

    const extras: FixExtras = {};

    if (brecord.enl) {
      extras.engineNoiseLevel = brecord.enl;
    }

    if (brecord.extensions.MOP) {
      extras.meansOfPropulsion = +brecord.extensions.MOP / 1000;
    }

    return new Fix(
      new Date(brecord.timestamp),
      brecord.latitude,
      brecord.longitude,
      brecord.gpsAltitude || 0,
      brecord.pressureAltitude,
      extras
    );
  }
}

export default Parser;
