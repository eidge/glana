import Unit from './unit';
import { makeQuantityFactory } from './quantity_factory';

abstract class Temperature extends Unit {}

class Celsius extends Temperature {
  constructor() {
    super('degree celsius', '°C');
  }

  toStandardUnit(value: number) {
    return value;
  }

  fromStandardUnit(value: number) {
    return value;
  }
}

const degreeCelsius = makeQuantityFactory(new Celsius());

export { Temperature, Celsius, degreeCelsius };
