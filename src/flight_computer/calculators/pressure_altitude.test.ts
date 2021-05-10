import Fix from '../fix';
import DatumFactory from 'utils/datum_factory';
import PressureAltitude from './pressure_altitude';
import { meters } from 'units/length';
import { hpa } from 'units/pressure';

const uselessDatum = new DatumFactory().nextDatum();

describe('PressureAltitude', () => {
  it('returns 0 when it has not yet received a fix', () => {
    const pressureAltitude = new PressureAltitude();
    expect(pressureAltitude.getValue()!.value).toEqual(0);
  });

  it('returns fix altitude when pressure is default', () => {
    const pressureAltitude = new PressureAltitude(hpa(1013.25));
    const fix = new Fix(new Date(), 40.0, 8, 1200);
    pressureAltitude.update(fix, uselessDatum);
    expect(pressureAltitude.getValue()!.convertTo(meters).value).toBeCloseTo(
      1200
    );
  });

  it('corrects for low pressures', () => {
    const pressureAltitude = new PressureAltitude(hpa(1003.25));
    const fix = new Fix(new Date(), 40.0, 8, 1200);
    pressureAltitude.update(fix, uselessDatum);
    expect(pressureAltitude.getValue()!.convertTo(meters).value).toBeCloseTo(
      1291.44
    );
  });

  it('corrects for high pressures', () => {
    const pressureAltitude = new PressureAltitude(hpa(1033.25));
    const fix = new Fix(new Date(), 40.0, 8, 1200);
    pressureAltitude.update(fix, uselessDatum);
    expect(pressureAltitude.getValue()!.convertTo(meters).value).toBeCloseTo(
      1017.12
    );
  });
});
