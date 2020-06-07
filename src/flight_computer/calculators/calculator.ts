import Fix from '../fix';
import Unit from 'units/unit';

abstract class Calculator {
  abstract name(): string;
  abstract update(fix: Fix): void;
  abstract getValue(): Unit | null;

  toString() {
    return `${this.name()}: ${this.getValue()?.toString()}`;
  }
}

export default Calculator;
