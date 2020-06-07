import Calculator from './calculator';
import Fix from 'flight_computer/fix';
import { Speed } from 'units/speed';
import { Second, Millisecond } from 'units/time';
import { Meter } from 'units/length';

class Vario extends Calculator {
  verticalSpeed: Speed | null = null;
  lastFix: Fix | null = null;

  name(): string {
    return 'Vario';
  }

  update(fix: Fix): void {
    if (this.lastFix) {
      const ellapsedTime = this.ellapsedTime(fix, this.lastFix);
      const altitudeGain = fix.position.altitude.subtract(
        this.lastFix.position.altitude
      );
      this.verticalSpeed = new Speed(altitudeGain, Second.from(ellapsedTime));
    } else {
      this.verticalSpeed = new Speed(new Meter(0), new Second(1));
    }

    this.lastFix = fix;
  }

  private ellapsedTime(fix: Fix, lastFix: Fix) {
    const milliseconds = fix.updatedAt.getTime() - lastFix.updatedAt.getTime();
    return new Millisecond(milliseconds);
  }

  getValue() {
    return this.verticalSpeed;
  }
}

export default Vario;
