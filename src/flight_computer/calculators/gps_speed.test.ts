import GPSSpeed from './gps_speed';
import Fix from '../fix';
import { metersPerSecond } from '../../units/speed';
import DatumFactory from 'utils/datum_factory';

const uselessDatum = new DatumFactory().nextDatum();

describe('GPS Speed', () => {
  it('returns null when it has not yet received a fix', () => {
    const speed = new GPSSpeed();
    expect(speed.getValue()).toBeNull();
  });

  it('returns 0 after first fix', () => {
    const speed = new GPSSpeed();
    const fix = new Fix(new Date(), 40.0, 8, 1200);
    speed.update(fix, uselessDatum);
    expect(speed.getValue()?.value).toEqual(0);
  });

  it('returns correct speed', () => {
    const speed = new GPSSpeed();
    const fix1 = new Fix(new Date('2020-06-06T14:01:00.000Z'), 40.0, 8, 1200);
    const fix2 = new Fix(
      new Date('2020-06-06T14:01:01.000Z'),
      40.0,
      8.001,
      1198
    );

    speed.update(fix1, uselessDatum);
    speed.update(fix2, uselessDatum);

    expect(speed.getValue()?.convertTo(metersPerSecond).value).toBeCloseTo(
      85.18
    );
  });
});
