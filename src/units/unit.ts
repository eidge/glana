abstract class Unit {
  abstract value: any;
  abstract unit: string;

  toString() {
    return `${this.value} ${this.unit}`;
  }
}

export default Unit;
