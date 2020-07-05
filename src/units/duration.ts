import Unit from './unit';
import { makeQuantityFactory } from './quantity_factory';

abstract class Duration extends Unit {}

class Millisecond extends Duration {
  constructor() {
    super('millisecond', 'ms');
  }

  toStandardUnit(value: number) {
    return value / 1000;
  }

  fromStandardUnit(value: number) {
    return value * 1000;
  }
}

class Second extends Duration {
  constructor() {
    super('second', 's');
  }

  toStandardUnit(value: number) {
    return value;
  }

  fromStandardUnit(value: number) {
    return value;
  }
}

class Minute extends Duration {
  constructor() {
    super('second', 's');
  }

  toStandardUnit(value: number) {
    return value * 60;
  }

  fromStandardUnit(value: number) {
    return value / 60;
  }
}

class Hour extends Duration {
  constructor() {
    super('hour', 'h');
  }

  toStandardUnit(value: number) {
    return value * 3600;
  }

  fromStandardUnit(value: number) {
    return value / 3600;
  }
}

const milliseconds = makeQuantityFactory(new Millisecond());
const seconds = makeQuantityFactory(new Second());
const minutes = makeQuantityFactory(new Minute());
const hours = makeQuantityFactory(new Hour());

export {
  Duration,
  Millisecond,
  milliseconds,
  Second,
  seconds,
  Minute,
  minutes,
  Hour,
  hours,
};
