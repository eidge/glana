import Calculator from './calculator';
import Fix from '../fix';
import { meters, Meter } from '../../units/length';
import { milliseconds } from '../../units/duration';
import { Speed } from '../../units/speed';
import Quantity from '../../units/quantity';
import { Datum } from '../computer';

abstract class AbstractSpeedCalculator extends Calculator {
  speed: Quantity<Speed> | null = null;
  lastFix: Fix | null = null;

  update(fix: Fix, _datum: Datum): void {
    if (this.lastFix) {
      const ellapsedTime = this.ellapsedTime(fix, this.lastFix);
      const distanceDelta = this.distanceDelta(fix, this.lastFix);
      this.speed = Speed.create(distanceDelta, ellapsedTime);
    } else {
      this.speed = Speed.create(meters(0), milliseconds(1));
    }

    this.lastFix = fix;
  }

  abstract distanceDelta(fix: Fix, lastFix: Fix): Quantity<Meter>;

  private ellapsedTime(fix: Fix, lastFix: Fix) {
    const millis = fix.timestamp.getTime() - lastFix.timestamp.getTime();
    return milliseconds(millis);
  }

  getValue() {
    return this.speed;
  }
}

export default AbstractSpeedCalculator;
