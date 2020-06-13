import Unit from './unit';
import { Length, meters, kilometers } from './length';
import { Duration, seconds, hours } from './duration';
import Quantity from './quantity';

class Speed extends Unit {
  private lengthUnit: Length;
  private durationUnit: Duration;

  static create(dx: Quantity<Length>, dt: Quantity<Duration>) {
    const speed = new Speed(dx.unit, dt.unit);
    return speed.create(dx.value / dt.value);
  }

  constructor(lengthUnit: Length, durationUnit: Duration) {
    super(
      `${lengthUnit.name} per ${durationUnit.name}`,
      `${lengthUnit.symbol}/${durationUnit.symbol}`
    );

    this.lengthUnit = lengthUnit;
    this.durationUnit = durationUnit;
  }

  toStandardUnit(value: number): number {
    return (
      this.lengthUnit.toStandardUnit(value) /
      this.durationUnit.toStandardUnit(1)
    );
  }

  fromStandardUnit(value: number): number {
    return (
      this.lengthUnit.fromStandardUnit(value) /
      this.durationUnit.fromStandardUnit(1)
    );
  }
}

const metersPerSecond = new Speed(meters, seconds);
const kilometersPerHour = new Speed(kilometers, hours);

export { Speed, metersPerSecond, kilometersPerHour };
