import Calculator from './calculator';
import Quantity from '../../units/quantity';
import { Pressure, hpa } from '../../units/pressure';
import { Length, feet } from '../../units/length';
import Fix from '../fix';
import { Datum } from '../computer';

const DEFAULT_PRESSURE = hpa(1013.25);

export default class PressureAltitude extends Calculator {
  qnh: Quantity<Pressure>;
  altitude: Quantity<Length> | null = feet(0);

  constructor(qnh: Quantity<Pressure> = DEFAULT_PRESSURE) {
    super();
    this.qnh = qnh;
  }

  name(): string {
    return 'Altitude (QNH)';
  }

  update(fix: Fix, _previousDatum: Datum): void {
    const standardAltitude = fix.position.altitude;
    const pressureDifference = DEFAULT_PRESSURE.subtract(this.qnh).convertTo(
      hpa
    );

    this.altitude = standardAltitude.add(feet(30 * pressureDifference.value));
  }

  getValue() {
    return this.altitude;
  }
}
