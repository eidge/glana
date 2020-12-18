import DatumFactory from 'utils/datum_factory';
import Analysis from 'analysis';
import { kilometersPerHour } from 'units/speed';
import { degrees } from 'units/angle';
import { seconds } from 'units/duration';
import SavedFlight from 'saved_flight';

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
      expect(flight.phases[0].startIdx).toEqual(0);
      expect(flight.phases[0].endIdx).toEqual(4);
      expect(flight.datums[flight.phases[0].startIdx].state).toEqual('stopped');
      expect(flight.datums[flight.phases[0].endIdx].state).toEqual('stopped');
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
      expect(flight.phases[0].startIdx).toEqual(0);
      expect(flight.phases[0].endIdx).toEqual(6);
      expect(flight.datums[flight.phases[0].startIdx].state).toEqual('stopped');
      expect(flight.datums[flight.phases[0].endIdx].state).toEqual('stopped');

      expect(flight.phases[1].type).toEqual('gliding');
      expect(flight.phases[1].startIdx).toEqual(7);
      expect(flight.phases[1].endIdx).toEqual(24);
      expect(flight.datums[flight.phases[1].startIdx].state).toEqual('gliding');
      expect(flight.datums[flight.phases[1].endIdx].state).toEqual('gliding');
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
