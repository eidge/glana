import Unit from './unit';
import { Length, meters, kilometers, nauticalMiles } from './length';
import { Duration, seconds, hours } from './duration';
import Quantity from './quantity';
import { makeQuantityFactory } from './quantity_factory';

class Speed extends Unit {
  private lengthUnit: Length;
  private durationUnit: Duration;

  static create(dx: Quantity<Length>, dt: Quantity<Duration>) {
    const speedUnit = new Speed(dx.unit, dt.unit);
    return new Quantity(dx.value / dt.value, speedUnit);
  }

  constructor(
    lengthUnit: Length,
    durationUnit: Duration,
    name?: string,
    unit?: string
  ) {
    super(
      name || `${lengthUnit.name} per ${durationUnit.name}`,
      unit || `${lengthUnit.symbol}/${durationUnit.symbol}`
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

const metersPerSecond = makeQuantityFactory<Speed>(
  new Speed(meters.unit, seconds.unit)
);

const kilometersPerHour = makeQuantityFactory<Speed>(
  new Speed(kilometers.unit, hours.unit)
);

const knots = makeQuantityFactory<Speed>(
  new Speed(nauticalMiles.unit, hours.unit, undefined, 'kts')
);

export { Speed, metersPerSecond, kilometersPerHour, knots };
