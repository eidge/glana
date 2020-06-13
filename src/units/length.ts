import Unit from './unit';

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

const meters = new Meter();
const kilometers = new Kilometer();

export { Length, Meter, Kilometer, meters, kilometers };
