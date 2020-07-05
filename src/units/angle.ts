import Unit from './unit';
import { makeQuantityFactory } from './quantity_factory';

abstract class Angle extends Unit {}

class Degree extends Angle {
  constructor() {
    super('degree', '°');
  }

  toStandardUnit(value: number) {
    return value;
  }

  fromStandardUnit(value: number) {
    return value;
  }

  normalise(value: number) {
    value = value % 360;
    if (value < 0) value += 360;
    return value;
  }
}

const degrees = makeQuantityFactory(new Degree());

export { Angle, Degree, degrees };
