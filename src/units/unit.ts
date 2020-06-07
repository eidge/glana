function subtract<U extends Unit>(quantity1: U, quantity2: U) {
  return quantity1.value - quantity2.value;
}

abstract class Unit {
  abstract value: any;
  abstract unit: string;

  toString() {
    return `${this.value} ${this.unit}`;
  }

  subtract(otherQuantity: Unit) {
    const newQuantity = Object.assign({}, this);
    newQuantity.value = subtract(this, otherQuantity);
    return newQuantity;
  }
}

export default Unit;
