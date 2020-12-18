import { kilometersPerHour, metersPerSecond } from 'units/speed';
import { Datum } from 'flight_computer/computer';
import SavedFlight from 'saved_flight';
import Glide from './glide';
import DatumFactory from 'utils/datum_factory';
import { meters } from 'units/length';
import { degrees } from 'units/angle';
import { dimensionless } from 'units/dimensionless';

function newGlide(datums: Datum[]) {
  const flight = new SavedFlight(datums.map(d => d.toFix()));
  flight.datums = datums;
  return new Glide(flight, 0, datums.length - 1);
}

describe('Glide', () => {
  let datumFactory: DatumFactory;
  const startTime = new Date(1594898825139);

  beforeEach(done => {
    datumFactory = new DatumFactory({
      tickSizeInSeconds: 5,
      startTime: startTime,
    });
    datumFactory.setSpeed(kilometersPerHour(120));
    done();
  });

  describe('distance()', () => {
    it('returns zero for single datum glide', () => {
      const datum = datumFactory.nextDatum();
      const glide = newGlide([datum]);
      expect(glide.distance).toEqual(meters(0));
    });

    it("returns zero if glider isn't moving", () => {
      const datums = datumFactory.setSpeed(metersPerSecond(0)).nextDatums(5);
      const glide = newGlide(datums);
      expect(glide.distance).toEqual(meters(0));
    });

    it('returns distance between two datums', () => {
      const d1 = datumFactory.nextDatum();
      const d2 = datumFactory.setSpeed(metersPerSecond(100)).nextDatum();
      const glide = newGlide([d1, d2]);
      expect(glide.distance.convertTo(meters).value).toBeCloseTo(
        meters(500).value
      );
    });

    it('returns distance travelled', () => {
      const datums = datumFactory.setSpeed(metersPerSecond(100)).nextDatums(3);
      const glide = newGlide(datums);
      expect(glide.distance.convertTo(meters).value).toBeCloseTo(
        meters(1000).value
      );
    });

    it('returns distance travelled regardless of heading', () => {
      const d1 = datumFactory.setSpeed(metersPerSecond(100)).nextDatum();
      const d2 = datumFactory.turnRight(degrees(90)).nextDatum();
      const d3 = datumFactory.turnRight(degrees(90)).nextDatum();
      const glide = newGlide([d1, d2, d3]);
      expect(glide.distance.convertTo(meters).value).toBeCloseTo(
        meters(1000).value
      );
    });
  });

  describe('speed()', () => {
    it('returns zero for single datum glide', () => {
      const datum = datumFactory.nextDatum();
      const glide = newGlide([datum]);
      expect(glide.speed).toEqual(metersPerSecond(0));
    });

    it("returns zero if glider isn't moving", () => {
      const datums = datumFactory.setSpeed(metersPerSecond(0)).nextDatums(5);
      const glide = newGlide(datums);
      expect(glide.speed).toEqual(metersPerSecond(0));
    });

    it('returns speed between two datums', () => {
      const d1 = datumFactory.nextDatum();
      const d2 = datumFactory.setSpeed(metersPerSecond(100)).nextDatum();
      const glide = newGlide([d1, d2]);
      expect(glide.speed.convertTo(metersPerSecond).value).toBeCloseTo(
        metersPerSecond(100).value
      );
    });

    it('returns distance travelled', () => {
      const datums = datumFactory.setSpeed(metersPerSecond(100)).nextDatums(3);
      const glide = newGlide(datums);
      expect(glide.speed.convertTo(metersPerSecond).value).toBeCloseTo(
        metersPerSecond(100).value
      );
    });
  });

  describe('glideAngle()', () => {
    it('returns zero for single datum glide', () => {
      const datum = datumFactory.nextDatum();
      const glide = newGlide([datum]);
      expect(glide.glideAngle).toEqual(dimensionless(0));
    });

    it("returns zero if glider isn't moving", () => {
      const datums = datumFactory.setSpeed(metersPerSecond(0)).nextDatums(5);
      const glide = newGlide(datums);
      expect(glide.glideAngle).toEqual(dimensionless(0));
    });

    it('returns positive glide angle when altitude was lost', () => {
      datumFactory
        .setSpeed(metersPerSecond(100))
        .setVario(metersPerSecond(-10));
      const datums = datumFactory.nextDatums(3);
      const glide = newGlide(datums);
      expect(glide.speed.convertTo(metersPerSecond).value).toBeCloseTo(
        metersPerSecond(100).value
      );
      expect(glide.glideAngle.value).toBeCloseTo(dimensionless(10).value);
    });

    it('returns infinity if altitude remained the same', () => {
      const datums = datumFactory.setSpeed(metersPerSecond(100)).nextDatums(3);
      const glide = newGlide(datums);
      expect(glide.speed.convertTo(metersPerSecond).value).toBeCloseTo(
        metersPerSecond(100).value
      );
      expect(glide.glideAngle).toEqual(dimensionless(Infinity));
    });

    it('returns negative glide angle when altitude was gained', () => {
      datumFactory.setSpeed(metersPerSecond(100)).setVario(metersPerSecond(10));
      const datums = datumFactory.nextDatums(3);
      const glide = newGlide(datums);
      expect(glide.speed.convertTo(metersPerSecond).value).toBeCloseTo(
        metersPerSecond(100).value
      );
      expect(glide.glideAngle.value).toBeCloseTo(dimensionless(-10).value);
    });
  });
});
