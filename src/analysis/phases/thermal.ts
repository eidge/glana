import Phase from './phase';
import { GliderState } from '../../flight_computer/state_machine';
import Quantity from '../../units/quantity';
import { Length } from '../../units/length';
import { Speed } from '../../units/speed';

export default class Thermal extends Phase {
  type: GliderState = 'thermalling';

  get altitudeGain(): Quantity<Length> {
    const d1 = this.flight.datums[this.startIdx];
    const d2 = this.flight.datums[this.endIdx];
    return d2.position.altitude.subtract(d1.position.altitude);
  }

  get climbRate(): Quantity<Speed> {
    return Speed.create(this.altitudeGain, this.duration);
  }

  get finalAltitude(): Quantity<Length> {
    const d2 = this.flight.datums[this.endIdx];
    return d2.position.altitude;
  }
}
