import Factory from './factory';
import Position from 'flight_computer/position';
import { TaskTurnpoint } from 'flight_computer/tasks/task';
import Line from '../segments/line';
import Turnpoint from '../turnpoint';
import { meters, kilometers } from '../../../../units/length';
import Sector from '../segments/sector';
import { degrees } from '../../../../units/angle';

class BGAFactory implements Factory {
  start(name: string, center: Position): TaskTurnpoint {
    let startLine = new Line(center, kilometers(12));
    return new Turnpoint(name, [startLine]);
  }

  turnpoint(name: string, center: Position): TaskTurnpoint {
    let sector = new Sector(center, kilometers(20), degrees(90));
    let barrel = new Sector(center, meters(500), degrees(360));
    return new Turnpoint(name, [sector, barrel]);
  }

  finish(name: string, center: Position): TaskTurnpoint {
    let finishLine = new Line(center, kilometers(12));
    return new Turnpoint(name, [finishLine]);
  }
}

const bgaFactory = new BGAFactory();

export default bgaFactory;
