import DatumFactory from '../../test/support/datum_factory';
import Analysis from 'analysis';
import { kilometersPerHour } from 'units/speed';
import Fix from 'flight_computer/fix';
import { degrees } from 'units/angle';
import { seconds } from 'units/duration';

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
      let analysis = new Analysis(fixes).perform();
      expect(analysis.getDatums().length).toEqual(5);

      analysis.getDatums().forEach((datum, index) => {
        expect(datum.position).toEqual(fixes[index].position);
      });
    });

    it('computes flight phases', () => {
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
        .nextDatums(5)
        .map(datum => datum.toFix());

      let landingFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .advanceTime(seconds(300))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let fixes = ([] as Fix[]).concat(
        stoppedFixes,
        glidingFixes,
        thermalFixes,
        moreGlidingFixes,
        landingFixes
      );

      let analysis = new Analysis(fixes).perform();
      expect(analysis.getPhases().map(p => p.type)).toEqual([
        'stopped',
        'gliding',
        'thermalling',
        'gliding',
        'stopped',
      ]);
      expect(analysis).toMatchSnapshot();
    });

    it('computes single flight phase', () => {
      let stoppedFixes = datumFactory
        .setSpeed(kilometersPerHour(0))
        .nextDatums(5)
        .map(datum => datum.toFix());

      let analysis = new Analysis(stoppedFixes).perform();
      expect(analysis.getPhases().length).toEqual(1);
      expect(analysis.getPhases()[0].type).toEqual('stopped');
    });
  });
});
