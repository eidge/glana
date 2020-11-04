import Task, { TaskTurnpoint } from './task';
import Turnpoint from './turnpoints/turnpoint';
import Sector from './turnpoints/segments/sector';
import Position from '../position';
import { degrees } from 'units/angle';
import { meters, kilometers } from 'units/length';
import { Datum } from 'flight_computer/computer';
import { kilometersPerHour, metersPerSecond } from 'units/speed';

function buildSector(center: Position) {
  return new Sector(center, meters(100), degrees(90));
}

function rotationDegrees(tp: TaskTurnpoint) {
  return tp.rotationAngle.convertTo(degrees).value;
}

let now = new Date();

function datumFromPosition(position: Position, overrideTimestamp?: Date) {
  let timestamp = overrideTimestamp || new Date(now.getTime() + 5000);
  return new Datum(
    timestamp,
    position,
    degrees(0),
    kilometersPerHour(0),
    metersPerSecond(0),
    'gliding'
  );
}

describe('Task', () => {
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

  describe('#constructor', () => {
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

    it('rotates middle turnpoint clockwise', () => {
      let task = new Task([tp1, tp2, tp3]);
      expect(rotationDegrees(task.turnpoints[1])).toBeCloseTo(360 - 45);
    });

    it('rotates middle turnpoint counter-clockwise', () => {
      let task = new Task([tp3, tp2, tp1]);
      expect(rotationDegrees(task.turnpoints[1])).toBeCloseTo(360 - 45);
    });
  });

  describe('update', () => {
    describe('before starting task', () => {
      it('next turnpoint is first turnpoint', () => {
        let task = new Task([tp1, tp2]);
        expect(task.getNextTurnpoint()).toEqual(tp1);
        expect(task.getTurnpointReachedAt(tp1)).toBeNull();
        expect(task.isStarted()).toBeFalsy();
        expect(task.isFinished()).toBeFalsy();
      });

      it('does not change current turnpoint when position is outside tp1', () => {
        let task = new Task([tp1, tp2]);
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        expect(task.getNextTurnpoint()).toEqual(tp1);
      });

      it('does not change current turnpoint when there is no last position', () => {
        let task = new Task([tp1, tp2]);
        task.update(datumFromPosition(tp1.center));
        expect(task.getNextTurnpoint()).toEqual(tp1);
      });

      it('moves to next turnpoint when position is inside tp1', () => {
        let task = new Task([tp1, tp2]);
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        task.update(datumFromPosition(tp1.center));
        expect(task.getNextTurnpoint()).toEqual(tp2);
      });

      it('tracks start time', () => {
        let task = new Task([tp1, tp2]);
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        task.update(datumFromPosition(tp1.center, new Date(1000)));
        expect(task.getTurnpointReachedAt(tp1)).toEqual(new Date(1000));
      });
    });

    describe('after first turnpoint', () => {
      let task: Task;

      beforeEach(done => {
        task = new Task([tp1, tp2, tp3]);
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        task.update(datumFromPosition(tp1.center, new Date(1000)));
        done();
      });

      it('next turnpoint is second turnpoint', () => {
        expect(task.getNextTurnpoint()).toEqual(tp2);
        expect(task.getTurnpointReachedAt(tp2)).toBeNull();
        expect(task.isStarted()).toBeTruthy();
        expect(task.isFinished()).toBeFalsy();
      });

      it('does not change current turnpoint when position is outside tp2', () => {
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        expect(task.getNextTurnpoint()).toEqual(tp2);
      });

      it('moves to next turnpoint when position is inside tp2', () => {
        task.update(datumFromPosition(tp2.center));
        expect(task.getNextTurnpoint()).toEqual(tp3);
      });

      it('resets start time if tp1 is crossed again', () => {
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        expect(task.getTurnpointReachedAt(tp1)).toEqual(new Date(1000));

        task.update(datumFromPosition(tp1.center, new Date(2000)));
        expect(task.getTurnpointReachedAt(tp1)).toEqual(new Date(2000));
      });
    });

    describe('reaching final turnpoint', () => {
      let task: Task;

      beforeEach(done => {
        task = new Task([tp1, tp2, tp3]);
        let position = new Position(degrees(0), degrees(0), meters(0));
        task.update(datumFromPosition(position));
        task.update(datumFromPosition(tp1.center, new Date(1000)));
        task.update(datumFromPosition(tp2.center, new Date(2000)));
        done();
      });

      it('next turnpoint is third turnpoint', () => {
        expect(task.getNextTurnpoint()).toEqual(tp3);
        expect(task.getTurnpointReachedAt(tp3)).toBeNull();
        expect(task.isStarted()).toBeTruthy();
        expect(task.isFinished()).toBeFalsy();
      });

      it('finishes task', () => {
        task.update(datumFromPosition(tp3.center, new Date(3000)));
        expect(task.getNextTurnpoint()).toBeNull();
        expect(task.getTurnpointReachedAt(tp3)).toEqual(new Date(3000));
        expect(task.isStarted()).toBeFalsy();
        expect(task.isFinished()).toBeTruthy();
      });
    });
  });
});
