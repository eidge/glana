import Fix from 'flight_computer/fix';
import AbstractSpeedCalculator from './abstract_speed_calculator';

class Vario extends AbstractSpeedCalculator {
  name(): string {
    return 'Vario';
  }

  distanceDelta(fix: Fix, lastFix: Fix) {
    return fix.position.altitude.subtract(lastFix.position.altitude);
  }
}

export default Vario;
