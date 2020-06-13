import Unit from './unit';
import { makeQuantityFactory } from './quantity_factory';

abstract class Length extends Unit {}

class Meter extends Length {
  constructor() {
    super('meter', 'm');
  }

  toStandardUnit(value: number) {
    return value;
  }

  fromStandardUnit(value: number) {
    return value;
  }
}

class Kilometer extends Length {
  constructor() {
    super('kilometer', 'km');
  }

  toStandardUnit(value: number) {
    return value * 1000;
  }

  fromStandardUnit(value: number) {
    return value / 1000;
  }
}

const meters = makeQuantityFactory(new Meter());
const kilometers = makeQuantityFactory(new Kilometer());

export { Length, Meter, Kilometer, meters, kilometers };
