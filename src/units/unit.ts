import Quantity from './quantity';

abstract class Unit {
  readonly name: string;
  readonly symbol: string;

  constructor(name: string, symbol: string) {
    this.name = name;
    this.symbol = symbol;
  }

  abstract toStandardUnit(value: number): number;
  abstract fromStandardUnit(value: number): number;

  create(value: number) {
    return new Quantity(value, this);
  }
}

export default Unit;
