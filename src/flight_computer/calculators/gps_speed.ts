import Fix from 'flight_computer/fix';
import AbstractSpeedCalculator from './abstract_speed_calculator';

class GPSSpeed extends AbstractSpeedCalculator {
  name(): string {
    return 'GPS Speed';
  }

  distanceDelta(fix: Fix, lastFix: Fix) {
    return lastFix.position.distance2DTo(fix.position);
  }
}

export default GPSSpeed;
