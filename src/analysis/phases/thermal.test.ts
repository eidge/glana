import { Datum } from 'flight_computer/computer';
import SavedFlight from 'saved_flight';
import Thermal from './thermal';
import DatumFactory from 'utils/datum_factory';
import { kilometersPerHour, metersPerSecond } from 'units/speed';
import { meters } from 'units/length';

function newThermal(datums: Datum[]) {
  const flight = new SavedFlight(datums.map(d => d.toFix()));
  flight.datums = datums;
  return new Thermal(flight, 0, datums.length - 1);
}

describe('Thermal', () => {
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

  describe('altitudeGain()', () => {
    it('returns zero for single datum thermal', () => {
      const datum = datumFactory.nextDatum();
      const thermal = newThermal([datum]);
      expect(thermal.altitudeGain).toEqual(meters(0));
    });

    it("returns zero if glider hasn't changed altitude", () => {
      const datums = datumFactory.nextDatums(2);
      const thermal = newThermal(datums);
      expect(thermal.altitudeGain).toEqual(meters(0));
    });

    it('returns altitude gain between two datums', () => {
      const datums = datumFactory.setVario(metersPerSecond(1)).nextDatums(2);
      const thermal = newThermal(datums);
      expect(thermal.altitudeGain).toEqual(meters(5));
    });

    it('returns altitude lost between two datums', () => {
      const datums = datumFactory.setVario(metersPerSecond(-1)).nextDatums(2);
      const thermal = newThermal(datums);
      expect(thermal.altitudeGain).toEqual(meters(-5));
    });

    it('returns altitude between start and finish datums', () => {
      const firstDatum = datumFactory.nextDatum();
      const middleDatums = datumFactory
        .setVario(metersPerSecond(1))
        .nextDatums(5);
      const lastDatum = datumFactory.nextDatum();
      firstDatum.position.altitude = meters(200);
      lastDatum.position.altitude = meters(300);
      const thermal = newThermal([firstDatum, ...middleDatums, lastDatum]);
      expect(thermal.altitudeGain).toEqual(meters(100));
    });
  });

  describe('climbRate()', () => {
    it('returns zero for single datum thermal', () => {
      const datum = datumFactory.nextDatum();
      const thermal = newThermal([datum]);
      expect(thermal.climbRate).toEqual(metersPerSecond(0));
    });

    it("returns zero if glider hasn't changed altitude", () => {
      const datums = datumFactory.nextDatums(2);
      const thermal = newThermal(datums);
      expect(thermal.climbRate).toEqual(metersPerSecond(0));
    });

    it('returns positive climb rate between two datums', () => {
      const datums = datumFactory.setVario(metersPerSecond(1)).nextDatums(2);
      const thermal = newThermal(datums);
      expect(thermal.climbRate).toEqual(metersPerSecond(1));
    });

    it('returns negative climb rate between two datums', () => {
      const datums = datumFactory.setVario(metersPerSecond(-1)).nextDatums(2);
      const thermal = newThermal(datums);
      expect(thermal.climbRate).toEqual(metersPerSecond(-1));
    });

    it('returns climb rate between start and finish datums', () => {
      const firstDatum = datumFactory.nextDatum();
      const middleDatums = datumFactory
        .setVario(metersPerSecond(1))
        .nextDatums(2);
      const lastDatum = datumFactory.nextDatum();
      firstDatum.position.altitude = meters(150);
      lastDatum.position.altitude = meters(300);

      const thermal = newThermal([firstDatum, ...middleDatums, lastDatum]);
      expect(thermal.climbRate).toEqual(metersPerSecond(10));
    });
  });
});
