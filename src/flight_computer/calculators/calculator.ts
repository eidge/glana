import Fix from '../fix';
import Quantity from '../../units/quantity';
import Unit from '../../units/unit';
import { Datum } from '../computer';

abstract class Calculator {
  abstract name(): string;
  abstract update(fix: Fix, previousDatum: Datum): void;
  abstract getValue(): Quantity<Unit> | null;

  toString() {
    return `${this.name()}: ${this.getValue()?.toString()}`;
  }
}

export default Calculator;
