import GPSSpeed from './gps_speed';
import Fix from '../fix';

describe('GPS Speed', () => {
  it('returns null when it has not yet received a fix', () => {
    const speed = new GPSSpeed();
    expect(speed.getValue()).toBeNull();
  });

  it('returns 0 after first fix', () => {
    const speed = new GPSSpeed();
    const fix = new Fix(new Date(), 40.0, 8, 1200);
    speed.update(fix);
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

    speed.update(fix1);
    speed.update(fix2);

    expect(speed.getValue()?.value).toBeCloseTo(85.3);
  });
});
