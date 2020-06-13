abstract class Unit {
  readonly name: string;
  readonly symbol: string;

  constructor(name: string, symbol: string) {
    this.name = name;
    this.symbol = symbol;
  }

  abstract toStandardUnit(value: number): number;
  abstract fromStandardUnit(value: number): number;
}

export default Unit;
