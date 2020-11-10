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

class Feet extends Length {
  constructor() {
    super('feet', 'ft');
  }

  toStandardUnit(value: number) {
    return value * 0.3048;
  }

  fromStandardUnit(value: number) {
    return value / 0.3048;
  }
}

class NauticalMile extends Length {
  constructor() {
    super('nautical mile', 'nm');
  }

  toStandardUnit(value: number) {
    return value * 1852.8;
  }

  fromStandardUnit(value: number) {
    return value / 1852.8;
  }
}

const meters = makeQuantityFactory(new Meter());
const kilometers = makeQuantityFactory(new Kilometer());
const feet = makeQuantityFactory(new Feet());
const nauticalMiles = makeQuantityFactory(new NauticalMile());

export {
  Length,
  Meter,
  Kilometer,
  Feet,
  NauticalMile,
  meters,
  kilometers,
  feet,
  nauticalMiles,
};
