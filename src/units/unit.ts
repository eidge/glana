abstract class Unit {
  readonly name: string;
  readonly symbol: string;

  constructor(name: string, symbol: string) {
    this.name = name;
    this.symbol = symbol;
  }

  abstract toStandardUnit(value: number): number;
  abstract fromStandardUnit(value: number): number;

  normalise(value: number) {
    // Used for circular units like angles
    return value;
  }

  add(lhs: number, rhs: number) {
    return lhs + rhs;
  }

  subtract(lhs: number, rhs: number) {
    return lhs - rhs;
  }

  multiply(lhs: number, rhs: number) {
    return lhs * rhs;
  }

  divide(lhs: number, rhs: number) {
    return lhs / rhs;
  }

  greaterThan(lhs: number, rhs: number) {
    return lhs > rhs;
  }

  lessThan(lhs: number, rhs: number) {
    return lhs < rhs;
  }

  equals(lhs: number, rhs: number) {
    return lhs === rhs;
  }
}

export default Unit;
