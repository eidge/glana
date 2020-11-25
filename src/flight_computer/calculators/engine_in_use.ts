import Calculator from './calculator';
import Fix from '../fix';
import { Datum } from '../computer';
import MovingWindow from '../../math/moving_window';
import { dimensionless } from '../../units/dimensionless';
import { seconds } from '../../units/duration';

const ENGINE_OFF = dimensionless(0);
const ENGINE_ON = dimensionless(1);

export default class EngineInUse extends Calculator {
  private window = new MovingWindow(seconds(30), dimensionless.unit);
  private threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  name() {
    return 'Engine ON';
  }

  update(fix: Fix, _datum: Datum) {
    if (!fix.engineNoiseLevel && fix.meansOfPropulsion) return;
    const value = (fix.engineNoiseLevel || 0) + (fix.meansOfPropulsion || 0);

    this.window.addValue({
      timestamp: fix.timestamp,
      value: dimensionless(value),
    });
  }

  getValue() {
    if (this.window.average().value > this.threshold / 2) {
      return ENGINE_ON;
    } else {
      return ENGINE_OFF;
    }
  }
}
