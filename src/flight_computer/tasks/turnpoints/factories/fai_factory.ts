import Factory from './factory';
import Position from 'flight_computer/position';
import { TaskTurnpoint } from 'flight_computer/tasks/task';
import Line from '../segments/line';
import Turnpoint from '../turnpoint';
import { meters, kilometers } from '../../../../units/length';
import Sector from '../segments/sector';
import { degrees } from 'units/angle';

class FAIFactory implements Factory {
  start(name: string, center: Position): TaskTurnpoint {
    let startLine = new Line(center, meters(1000));
    return new Turnpoint(name, [startLine]);
  }

  turnpoint(name: string, center: Position): TaskTurnpoint {
    let sector = new Sector(center, kilometers(20), degrees(90));
    return new Turnpoint(name, [sector]);
  }

  finish(name: string, center: Position): TaskTurnpoint {
    let finishLine = new Line(center, meters(1000));
    return new Turnpoint(name, [finishLine]);
  }
}

const faiFactory = new FAIFactory();

export default faiFactory;
