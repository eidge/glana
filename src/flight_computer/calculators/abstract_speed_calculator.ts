import Calculator from './calculator';
import Fix from 'flight_computer/fix';
import { Speed } from 'units/speed';
import { Second, Millisecond } from 'units/time';
import { Meter, Length } from 'units/length';

abstract class AbstractSpeedCalculator extends Calculator {
  speed: Speed | null = null;
  lastFix: Fix | null = null;

  update(fix: Fix): void {
    if (this.lastFix) {
      const ellapsedTime = this.ellapsedTime(fix, this.lastFix);
      const distanceDelta = this.distanceDelta(fix, this.lastFix);
      this.speed = new Speed(distanceDelta, Second.from(ellapsedTime));
    } else {
      this.speed = new Speed(new Meter(0), new Second(1));
    }

    this.lastFix = fix;
  }

  abstract distanceDelta(fix: Fix, lastFix: Fix): Length;

  private ellapsedTime(fix: Fix, lastFix: Fix) {
    const milliseconds = fix.updatedAt.getTime() - lastFix.updatedAt.getTime();
    return new Millisecond(milliseconds);
  }

  getValue() {
    return this.speed;
  }
}

export default AbstractSpeedCalculator;
