import Unit from './unit';

abstract class Time extends Unit {
  abstract unit: string;
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  static from(_time: Time) {
    throw new Error('Not implemented');
  }

  abstract toSeconds(): number;
}

class Millisecond extends Time {
  unit = 'ms';

  static from(time: Time) {
    return new Millisecond(time.toSeconds() * 1000);
  }

  toSeconds() {
    return this.value / 1000;
  }
}

class Second extends Time {
  unit = 's';

  static from(time: Time) {
    return new Second(time.toSeconds());
  }

  toSeconds() {
    return this.value;
  }
}

class Hour extends Time {
  unit = 'h';

  static from(time: Time) {
    return new Hour(time.toSeconds() / 3600);
  }

  toSeconds() {
    return this.value * 3600;
  }
}

export { Time, Millisecond, Second, Hour };
