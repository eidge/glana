import Unit from './unit';
import { QuantityFactory } from './quantity_factory';

class Quantity<U extends Unit> {
  value: number;
  unit: U;

  constructor(value: number, unit: U) {
    this.value = value;
    this.unit = unit;
  }

  convertTo(newUnitOrFactory: U | QuantityFactory) {
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

  subtract(rhs: Quantity<U>) {
    const newQuantity = Object.assign({}, this);
    newQuantity.value = this.value - rhs.convertTo(this.unit).value;
    return newQuantity;
  }

  equals(rhs: Quantity<U>) {
    return this.value === rhs.convertTo(this.unit).value;
  }

  toString() {
    return `${this.value.toFixed(1)}${this.unit.symbol}`;
  }
}

export default Quantity;
