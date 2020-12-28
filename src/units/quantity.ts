import Unit from './unit';
import { QuantityFactory } from './quantity_factory';

class Quantity<U extends Unit> {
  value: number;
  unit: U;

  constructor(value: number, unit: U) {
    this.value = value;
    this.unit = unit;
  }

  convertTo(newUnitOrFactory: U | QuantityFactory<U>) {
    let newUnit;

    if (newUnitOrFactory instanceof Unit) {
      newUnit = newUnitOrFactory;
    } else {
      newUnit = newUnitOrFactory.unit;
    }

    const standardValue = this.unit.toStandardUnit(this.value);
    const valueInNewUnit = newUnit.fromStandardUnit(standardValue);
    return new Quantity(valueInNewUnit, newUnit);
  }

  private clone() {
    return new Quantity(this.value, this.unit);
  }

  normalise() {
    const newQuantity = this.clone();
    newQuantity.value = this.unit.normalise(this.value);
    return newQuantity;
  }

  add(rhs: Quantity<U>) {
    const newQuantity = this.clone();
    newQuantity.value = this.unit.add(
      this.value,
      rhs.convertTo(this.unit).value
    );
    return newQuantity;
  }

  subtract(rhs: Quantity<U>): Quantity<U> {
    const newQuantity = this.clone();
    newQuantity.value = this.unit.subtract(
      this.value,
      rhs.convertTo(this.unit).value
    );
    return newQuantity;
  }

  multiply(rhs: number) {
    const newQuantity = this.clone();
    newQuantity.value = this.unit.multiply(this.value, rhs);
    return newQuantity;
  }

  divide(rhs: number) {
    const newQuantity = this.clone();
    newQuantity.value = this.unit.divide(this.value, rhs);
    return newQuantity;
  }

  equals(rhs: Quantity<U>) {
    return this.unit.equals(this.value, rhs.convertTo(this.unit).value);
  }

  greaterThan(rhs: Quantity<U>) {
    return this.unit.greaterThan(this.value, rhs.convertTo(this.unit).value);
  }

  lessThan(rhs: Quantity<U>) {
    return this.unit.lessThan(this.value, rhs.convertTo(this.unit).value);
  }

  equalOrGreaterThan(rhs: Quantity<U>) {
    return this.unit.equalOrGreaterThan(
      this.value,
      rhs.convertTo(this.unit).value
    );
  }

  equalOrLessThan(rhs: Quantity<U>) {
    return this.unit.equalOrLessThan(
      this.value,
      rhs.convertTo(this.unit).value
    );
  }

  toString(
    options: {
      precision?: number;
      padToSize?: number;
      alwaysShowSign?: boolean;
    } = {}
  ) {
    const precision = options.precision === undefined ? 1 : options.precision;
    const alwaysShowSign = options.alwaysShowSign || false;
    let valueStr = this.value.toFixed(precision);

    if (options.padToSize) {
      valueStr = valueStr.padStart(options.padToSize, '0');
    }

    if (alwaysShowSign && valueStr[0] !== '-') {
      valueStr = `+${valueStr}`;
    }

    return `${valueStr}${this.unit.symbol}`;
  }
}

export default Quantity;
