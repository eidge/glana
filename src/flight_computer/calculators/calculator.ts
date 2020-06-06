import Fix from '../fix';
import Unit from 'units/unit';

interface Calculator {
  name(): string;
  update(fix: Fix): void;
  getValue(): Unit | null;
}

export default Calculator;
