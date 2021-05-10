import Unit from './unit';
import { makeQuantityFactory } from './quantity_factory';

abstract class Pressure extends Unit {}

class HPa extends Pressure {
  constructor() {
    super('hPa', 'hPa');
  }

  toStandardUnit(value: number) {
    return value;
  }

  fromStandardUnit(value: number) {
    return value;
  }
}

const hpa = makeQuantityFactory(new HPa());

export { Pressure, HPa, hpa };
