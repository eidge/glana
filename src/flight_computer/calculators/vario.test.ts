import Vario from './vario';
import Fix from '../fix';
import { metersPerSecond } from 'units/speed';
import DatumFactory from 'utils/datum_factory';

const uselessDatum = new DatumFactory().nextDatum();

describe('Vario', () => {
  it('returns null when it has not yet received a fix', () => {
    const verticalSpeed = new Vario();
    expect(verticalSpeed.getValue()).toBeNull();
  });

  it('returns 0 after first fix', () => {
    const verticalSpeed = new Vario();
    const fix = new Fix(new Date(), 40.0, 8, 1200);
    verticalSpeed.update(fix, uselessDatum);
    expect(verticalSpeed.getValue()?.value).toEqual(0);
  });

  it('returns positive verticalSpeed', () => {
    const verticalSpeed = new Vario();
    const fix1 = new Fix(new Date('2020-06-06T14:01:00.000Z'), 40.0, 8, 1200);
    const fix2 = new Fix(
      new Date('2020-06-06T14:01:01.000Z'),
      40.0,
      8.001,
      1202
    );

    verticalSpeed.update(fix1, uselessDatum);
    verticalSpeed.update(fix2, uselessDatum);

    expect(verticalSpeed.getValue()?.convertTo(metersPerSecond)?.value).toEqual(
      2
    );
  });

  it('returns negative verticalSpeed', () => {
    const verticalSpeed = new Vario();
    const fix1 = new Fix(new Date('2020-06-06T14:01:00.000Z'), 40.0, 8, 1200);
    const fix2 = new Fix(
      new Date('2020-06-06T14:01:01.000Z'),
      40.0,
      8.001,
      1198
    );

    verticalSpeed.update(fix1, uselessDatum);
    verticalSpeed.update(fix2, uselessDatum);

    expect(verticalSpeed.getValue()?.convertTo(metersPerSecond)?.value).toEqual(
      -2
    );
  });
});
