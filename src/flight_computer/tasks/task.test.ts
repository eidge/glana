import Task, { TaskTurnpoint } from './task';
import Turnpoint from './turnpoints/turnpoint';
import Sector from './turnpoints/segments/sector';
import Position from '../position';
import { degrees } from 'units/angle';
import { meters, kilometers } from 'units/length';

function buildSector(center: Position) {
  return new Sector(center, meters(100), degrees(90));
}

function rotationDegrees(tp: TaskTurnpoint) {
  return tp.rotationAngle.convertTo(degrees).value;
}

describe('Task', () => {
  describe('#constructor', () => {
    let tp1: TaskTurnpoint;
    let tp2: TaskTurnpoint;
    let tp3: TaskTurnpoint;
    let tp4: TaskTurnpoint;
    let tp5: TaskTurnpoint;

    beforeEach(done => {
      let initialPosition = new Position(degrees(51.934), degrees(-0.635333));
      let north100k = initialPosition.move(kilometers(100), degrees(0));
      let east100k = north100k.move(kilometers(100), degrees(90));
      let south100k = east100k.move(kilometers(100), degrees(180));
      let west100k = south100k.move(kilometers(100), degrees(270));

      tp1 = new Turnpoint('tp1', [buildSector(initialPosition)]);
      tp2 = new Turnpoint('tp2', [buildSector(north100k)]);
      tp3 = new Turnpoint('tp3', [buildSector(east100k)]);
      tp4 = new Turnpoint('tp4', [buildSector(south100k)]);
      tp5 = new Turnpoint('tp4', [buildSector(west100k)]);

      done();
    });

    it('calculates task distance', () => {
      let task = new Task([tp1, tp2, tp3, tp4, tp5]);
      expect(task.distance.convertTo(kilometers)).toEqual(
        kilometers(400.00000000000216)
      );
    });

    it('does not rotate a single turnpoint', () => {
      let task = new Task([tp1]);
      expect(rotationDegrees(task.turnpoints[0])).toBeCloseTo(0);
    });

    it('rotates two turnpoints correctly', () => {
      let task = new Task([tp1, tp2]);
      expect(rotationDegrees(task.turnpoints[0])).toBeCloseTo(0);
      expect(rotationDegrees(task.turnpoints[1])).toBeCloseTo(0);

      task = new Task([tp2, tp1]);
      expect(rotationDegrees(task.turnpoints[0])).toBeCloseTo(180);
      expect(rotationDegrees(task.turnpoints[1])).toBeCloseTo(180);
    });

    it('rotates three or more turnpoints correctly', () => {
      let task = new Task([tp1, tp2, tp3, tp4, tp5]);
      expect(rotationDegrees(task.turnpoints[0])).toBeCloseTo(0);
      expect(rotationDegrees(task.turnpoints[1])).toBeCloseTo(360 - 45);
      expect(rotationDegrees(task.turnpoints[2])).toBeCloseTo(45);
      expect(rotationDegrees(task.turnpoints[3])).toBeCloseTo(135);
      expect(rotationDegrees(task.turnpoints[4])).toBeCloseTo(270);
    });
  });
});
