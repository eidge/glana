import StateMachine from './state_machine';
import { degrees } from '../units/angle';
import { kilometersPerHour } from '../units/speed';

import DatumFactory from '../../test/support/datum_factory';
import { minutes } from 'units/duration';

describe('StateMachine', () => {
  let datumFactory: DatumFactory;

  beforeEach(done => {
    datumFactory = new DatumFactory({ tickSizeInSeconds: 5 });
    done();
  });

  describe('when stopped', () => {
    it("changes state to 'gliding' when speed is overe 50kph for over 10s", () => {
      const sm = new StateMachine();
      expect(sm.isStopped()).toBeTruthy();
      expect(sm.isGliding()).toBeFalsy();

      sm.update(datumFactory.setSpeed(kilometersPerHour(0)).nextDatum());
      sm.update(datumFactory.setSpeed(kilometersPerHour(90)).nextDatum());
      expect(sm.isStopped()).toBeTruthy();
      expect(sm.isGliding()).toBeFalsy();

      sm.update(datumFactory.setSpeed(kilometersPerHour(100)).nextDatum());
      expect(sm.isStopped()).toBeFalsy();
      expect(sm.isGliding()).toBeTruthy();
    });

    it('remains stopped if glider is not moving', () => {
      const sm = new StateMachine();

      sm.update(datumFactory.setSpeed(kilometersPerHour(0)).nextDatum());
      expect(sm.isStopped()).toBeTruthy();

      sm.update(datumFactory.setSpeed(kilometersPerHour(1)).nextDatum());
      expect(sm.isStopped()).toBeTruthy();
    });
  });

  describe('when gliding', () => {
    it('stops', () => {
      const sm = new StateMachine();
      sm.update(datumFactory.setSpeed(kilometersPerHour(100)).nextDatum());

      expect(sm.isGliding()).toBeTruthy();

      let datum = datumFactory
        .advanceTime(minutes(2))
        .setSpeed(kilometersPerHour(0))
        .nextDatum();
      sm.update(datum);

      expect(sm.isGliding()).toBeFalsy();
      expect(sm.isStopped()).toBeTruthy();
    });

    it("changes state to 'thermalling' when thermalling right", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnRight(degrees(100)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      expect(sm.isGliding()).toBeFalsy();
      expect(sm.isThermalling()).toBeTruthy();
    });

    it("changes state to 'thermalling' when thermalling left", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(100)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      expect(sm.isGliding()).toBeFalsy();
      expect(sm.isThermalling()).toBeTruthy();
    });

    it("remains 'gliding' when turn to the right is aborted", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(100)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      expect(sm.isGliding()).toBeTruthy();
      expect(sm.isThermalling()).toBeFalsy();
    });

    it("remains 'gliding' when turn to the left is aborted", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(100)).nextDatum());
      expect(sm.isGliding()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      expect(sm.isGliding()).toBeTruthy();
      expect(sm.isThermalling()).toBeFalsy();
    });
  });

  describe("when 'thermalling'", () => {
    it("changes state to 'gliding' when turning right", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      expect(sm.isThermalling()).toBeFalsy();
    });

    it("changes state to 'gliding' when turning left", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      expect(sm.isThermalling()).toBeFalsy();
    });

    it("remains 'thermalling' when recentering right", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      sm.update(datumFactory.turnRight(degrees(91)).nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.turnRight(degrees(90)).nextDatum());
      expect(sm.isThermalling()).toBeTruthy();
    });

    it("remains 'thermalling' when recentering left", () => {
      const sm = new StateMachine();

      datumFactory.setSpeed(kilometersPerHour(100));

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      sm.update(datumFactory.turnLeft(degrees(91)).nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      sm.update(datumFactory.nextDatum());
      expect(sm.isThermalling()).toBeTruthy();

      sm.update(datumFactory.turnLeft(degrees(90)).nextDatum());
      expect(sm.isThermalling()).toBeTruthy();
    });
  });
});
