import Unit from './unit';

abstract class Length extends Unit {
  abstract unit: string;
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  static from(_length: Length) {
    throw new Error('Not implemented');
  }

  abstract toMeters(): number;
}

class Meter extends Length {
  unit = 'm';

  static from(length: Length) {
    return new Meter(length.toMeters());
  }

  toMeters() {
    return this.value;
  }
}

class Kilometer extends Length {
  unit = 'km';

  static from(length: Length) {
    return new Kilometer(length.toMeters() / 1000.0);
  }

  toMeters() {
    return this.value * 1000;
  }
}

export { Length, Meter, Kilometer };
