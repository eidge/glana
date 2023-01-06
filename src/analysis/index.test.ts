import DatumFactory from 'utils/datum_factory';
import Analysis from 'analysis';
import { kilometersPerHour } from 'units/speed';
import { degrees } from 'units/angle';
import { seconds } from 'units/duration';
import SavedFlight from 'saved_flight';
import Turnpoint from 'flight_computer/tasks/turnpoints/turnpoint';
import { meters } from 'units/length';
import Sector from 'flight_computer/tasks/turnpoints/segments/sector';
import Task from 'flight_computer/tasks/task';

describe('Analysis', () => {
  let datumFactory: DatumFactory;

  beforeEach(done => {
    datumFactory = new DatumFactory({
      tickSizeInSeconds: 5,
      startTime: new Date(1594898825139),
    });
    done();
  });

  describe('perform()', () => {
    it('creates a datum for each fix', () => {
      let fixes = datumFactory.nextDatums(5).map(datum => datum.toFix());
      let flight = new SavedFlight(fixes);
      new Analysis().perform(flight);
      expect(flight.datums.length).toEqual(5);

      flight.datums.forEach((datum, index) => {
        expect(datum.position).toEqual(fixes[index].position);
      });
    });

    it('computes single flight phase correctly', () => {
      let stoppedFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let flight = new SavedFlight(stoppedFixes);
      new Analysis().perform(flight);

      expect(flight.phases.length).toEqual(1);
      expect(flight.phases[0].type).toEqual('stopped');
      expect(flight.phases[0].startIndex).toEqual(0);
      expect(flight.phases[0].endIndex).toEqual(4);
      expect(flight.datums[flight.phases[0].startIndex].state).toEqual(
        'stopped'
      );
      expect(flight.datums[flight.phases[0].endIndex].state).toEqual('stopped');
    });

    it('computes two flight phases correctly', () => {
      let stoppedFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let glidingFixes = datumFactory
        .setSpeed(kilometersPerHour(120))
        .nextDatums(20)
        .map(datum => datum.toFix());

      let flight = new SavedFlight([...stoppedFixes, ...glidingFixes]);
      new Analysis().perform(flight);

      expect(flight.phases.length).toEqual(2);

      expect(flight.phases[0].type).toEqual('stopped');
      expect(flight.phases[0].startIndex).toEqual(0);
      expect(flight.phases[0].endIndex).toEqual(6);
      expect(flight.datums[flight.phases[0].startIndex].state).toEqual(
        'stopped'
      );
      expect(flight.datums[flight.phases[0].endIndex].state).toEqual('stopped');

      expect(flight.phases[1].type).toEqual('gliding');
      expect(flight.phases[1].startIndex).toEqual(7);
      expect(flight.phases[1].endIndex).toEqual(24);
      expect(flight.datums[flight.phases[1].startIndex].state).toEqual(
        'gliding'
      );
      expect(flight.datums[flight.phases[1].endIndex].state).toEqual('gliding');
    });

    it('splits phases when a turnpoint is rounded', () => {
      let stoppedFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let glidingFixes = datumFactory
        .setSpeed(kilometersPerHour(120))
        .nextDatums(20)
        .map(datum => datum.toFix());

      let fixes = stoppedFixes.concat(glidingFixes);

      let tp1 = new Turnpoint('tp1', [
        new Sector(fixes[15].position, meters(10), degrees(360)),
      ]);
      let tp2 = new Turnpoint('tp2', [
        new Sector(fixes[fixes.length - 1].position, meters(10), degrees(180)),
      ]);
      let task = new Task([tp1, tp2]);

      let flight = new SavedFlight(fixes, task);

      new Analysis().perform(flight);

      expect(flight.phases[0].type).toEqual('stopped');

      expect(flight.phases[1].type).toEqual('gliding');
      expect(flight.phases[1].endIndex).toEqual(13);

      expect(flight.phases[2].type).toEqual('turnpoint');
      expect(flight.phases[2].startIndex).toEqual(14);
      expect(flight.phases[2].endIndex).toEqual(15);

      expect(flight.phases[3].type).toEqual('gliding');
      expect(flight.phases[3].startIndex).toEqual(16);
      expect(flight.phases[3].endIndex).toEqual(22);

      expect(flight.phases[4].type).toEqual('turnpoint');
      expect(flight.phases[4].startIndex).toEqual(23);
      expect(flight.phases[4].endIndex).toEqual(24);

      expect(flight.phases.length).toEqual(5);
    });

    it('computes many flight phases correctly', () => {
      let stoppedFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let glidingFixes = datumFactory
        .setSpeed(kilometersPerHour(120))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let thermalFixes = [
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
        datumFactory
          .turnRight(degrees(90))
          .nextDatum()
          .toFix(),
      ];

      let moreGlidingFixes = datumFactory
        .setSpeed(kilometersPerHour(120))
        .nextDatums(10)
        .map(datum => datum.toFix());

      let landingFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .advanceTime(seconds(300))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let fixes = [
        ...stoppedFixes,
        ...glidingFixes,
        ...thermalFixes,
        ...moreGlidingFixes,
        ...landingFixes,
      ];

      let flight = new SavedFlight(fixes);
      new Analysis().perform(flight);
      expect(flight.phases.map(p => p.type)).toEqual([
        'stopped',
        'gliding',
        'thermalling',
        'gliding',
        'stopped',
      ]);
    });
  });
});
