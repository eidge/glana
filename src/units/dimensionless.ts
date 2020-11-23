import Unit from './unit';
import { makeQuantityFactory } from './quantity_factory';

class Dimensionless extends Unit {
  constructor() {
    super('', '');
  }

  toStandardUnit(value: number) {
    return value;
  }

  fromStandardUnit(value: number) {
    return value;
  }
}

const dimensionless = makeQuantityFactory(new Dimensionless());

export { Dimensionless, dimensionless };
