import Calculator from './calculators/calculator';
import Fix from './fix';
import Quantity from '../units/quantity';
import Unit from '../units/unit';
import { Speed, kilometersPerHour, metersPerSecond } from '../units/speed';
import { Degree, degrees, Angle } from '../units/angle';
import GPSSpeed from './calculators/gps_speed';
import Vario from './calculators/vario';
import Heading from './calculators/heading';
import Position from './position';
import StateMachine, { GliderState } from './state_machine';
import { meters } from '../units/length';

export type CalculatorMap = Map<string, Calculator>;

type CalculatedValues = { [key: string]: Quantity<Unit> | null };

export class Datum {
  updatedAt: Date;
  position: Position;
  heading: Quantity<Degree>;
  speed: Quantity<Speed>;
  vario: Quantity<Speed>;
  calculatedValues: CalculatedValues = {};
  state: GliderState;

  constructor(
    updatedAt: Date,
    position: Position,
    heading: Quantity<Degree>,
    speed: Quantity<Speed>,
    vario: Quantity<Speed>,
    state: GliderState,
    calculatedValues: CalculatedValues = {}
  ) {
    this.updatedAt = updatedAt;
    this.position = position;
    this.heading = heading;
    this.speed = speed;
    this.vario = vario;
    this.state = state;
    this.calculatedValues = calculatedValues;
  }

  toFix() {
    return new Fix(
      this.updatedAt,
      this.position.latitude.value,
      this.position.longitude.value,
      this.position.altitude.convertTo(meters).value
    );
  }
}

export default class FlightComputer {
  currentDatum: Datum | null = null;
  private state = new StateMachine();
  private calculators: CalculatorMap = new Map();

  constructor(extraCalculators: CalculatorMap = new Map<string, Calculator>()) {
    this.calculators = this.withRequiredCalculators(extraCalculators);
  }

  private withRequiredCalculators(calculators: CalculatorMap) {
    calculators.set('speed', new GPSSpeed());
    calculators.set('vario', new Vario());
    calculators.set('heading', new Heading());
    return calculators;
  }

  update(fix: Fix) {
    if (this.currentDatum) this.updateCalculators(fix, this.currentDatum);
    this.currentDatum = this.buildDatum(fix);
    this.state.update(this.currentDatum);
  }

  private updateCalculators(fix: Fix, previousDatum: Datum) {
    this.calculators.forEach(calculator => {
      calculator.update(fix, previousDatum);
    });
  }

  private buildDatum(fix: Fix) {
    return new Datum(
      fix.updatedAt,
      fix.position,
      this.currentHeading() || degrees(0),
      this.currentSpeed() || kilometersPerHour(0),
      this.currentVario() || metersPerSecond(0),
      this.state.state,
      this.calculatedValues()
    );
  }

  private currentHeading() {
    return this.calculators.get('heading')!.getValue() as Quantity<
      Angle
    > | null;
  }

  private currentSpeed() {
    return this.calculators.get('speed')!.getValue() as Quantity<Speed> | null;
  }

  private currentVario() {
    return this.calculators.get('vario')!.getValue() as Quantity<Speed> | null;
  }

  private calculatedValues() {
    const values: CalculatedValues = {};
    this.calculators.forEach((calculator, name) => {
      values[name] = calculator.getValue();
    });
    return values;
  }
}
