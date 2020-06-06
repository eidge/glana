import Calculator from './calculator';
import Fix from 'flight_computer/fix';
import { Millisecond, Second } from 'units/time';
import { Meter } from 'units/length';
import { Speed } from 'units/speed';

class GPSSpeed implements Calculator {
  speed: Speed | null = null;
  lastFix: Fix | null = null;

  name(): string {
    return 'GPS Speed';
  }

  update(fix: Fix): void {
    if (this.lastFix) {
      const ellapsedTime = this.ellapsedTime(fix, this.lastFix);
      const distanceCovered = this.lastFix.position.distance2DTo(fix.position);
      this.speed = new Speed(distanceCovered, Second.from(ellapsedTime));
    } else {
      this.speed = new Speed(new Meter(0), new Second(1));
    }

    this.lastFix = fix;
  }

  private ellapsedTime(fix: Fix, lastFix: Fix) {
    const milliseconds = fix.updatedAt.getTime() - lastFix.updatedAt.getTime();
    return new Millisecond(milliseconds);
  }

  getValue() {
    return this.speed;
  }
}

export default GPSSpeed;
