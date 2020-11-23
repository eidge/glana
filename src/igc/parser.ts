import IGCParser from 'igc-parser';
import Fix, { FixExtras } from '../flight_computer/fix';
import SavedFlight from '../saved_flight';
import Factory from '../flight_computer/tasks/turnpoints/factories/factory';
import bgaFactory from '../flight_computer/tasks/turnpoints/factories/bga_factory';
import Position from '../flight_computer/position';
import { degrees } from '../units/angle';
import { meters } from '../units/length';
import Task from '../flight_computer/tasks/task';

class Parser {
  parse(igc_contents: string, turnpointFactory: Factory = bgaFactory) {
    let parsedIGC = IGCParser.parse(igc_contents);
    let fixes = parsedIGC.fixes.map(this.buildFix);
    let task = this.parseTask(parsedIGC.task, turnpointFactory);
    return new SavedFlight(fixes, task, {
      registration: parsedIGC.registration,
      callsign: parsedIGC.callsign,
    });
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
    const extras: FixExtras = {};

    if (brecord.enl) {
      extras.engineNoiseLevel = brecord.enl;
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
