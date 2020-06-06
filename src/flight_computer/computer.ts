import Calculator from './calculators/calculator';
import Fix from './fix';

type CalculatorMap = Map<string, Calculator>;

class FlightComputer {
  lastFix: Fix | null = null;
  calculators: CalculatorMap = new Map();

  constructor(calculators: CalculatorMap) {
    this.calculators = calculators;
  }

  update(fix: Fix) {
    this.calculators.forEach(calculator => {
      calculator.update(fix);
    });
    this.lastFix = fix;
  }
}

export default FlightComputer;
