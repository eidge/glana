import Unit from './unit';

class Quantity<U extends Unit> {
  value: number;
  unit: U;

  constructor(value: number, unit: U) {
    this.value = value;
    this.unit = unit;
  }

  convertTo(newUnit: Unit) {
    const standardValue = this.unit.toStandardUnit(this.value);
    const valueInNewUnit = newUnit.fromStandardUnit(standardValue);
    return new Quantity(valueInNewUnit, newUnit);
  }

  subtract(rhs: Quantity<Unit>) {
    const newQuantity = Object.assign({}, this);
    newQuantity.value = this.value - rhs.convertTo(this.unit).value;
    return newQuantity;
  }

  toString() {
    return `${this.value} ${this.unit.symbol}`;
  }
}

export default Quantity;
