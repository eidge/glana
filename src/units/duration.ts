import Unit from './unit';

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

const milliseconds = new Millisecond();
const seconds = new Second();
const hours = new Hour();

export { Duration, milliseconds, seconds, hours };
