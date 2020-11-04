import Quantity from '../../units/quantity';
import { Duration } from '../../units/duration';
import { metersPerSecond, Speed } from '../../units/speed';
import MovingWindow from '../../math/moving_window';
import Vario from './vario';
import Fix from '../fix';
import { Datum } from '../computer';

export default class AverageVario {
  movingWindow: MovingWindow<Speed>;
  varioCalculator: Vario;

  constructor(windowSize: Quantity<Duration>) {
    this.movingWindow = new MovingWindow(windowSize, metersPerSecond.unit);
    this.varioCalculator = new Vario();
  }

  name(): string {
    return 'Av. Vario';
  }

  update(fix: Fix, datum: Datum) {
    this.varioCalculator.update(fix, datum);
    let vario = this.varioCalculator.getValue();
    if (vario) {
      this.movingWindow.addValue({ timestamp: fix.timestamp, value: vario });
    }
  }

  getValue() {
    if (this.movingWindow.values.length === 0) {
      return null;
    }
    return this.movingWindow.average();
  }
}
