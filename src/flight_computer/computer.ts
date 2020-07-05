import Calculator from './calculators/calculator';
import Fix from './fix';
import Quantity from '../units/quantity';
import { Speed, kilometersPerHour, metersPerSecond } from '../units/speed';
import { Degree, degrees, Angle } from '../units/angle';
import GPSSpeed from './calculators/gps_speed';
import Vario from './calculators/vario';
import Heading from './calculators/heading';
import Position from './position';
import StateMachine from './state_machine';

export type CalculatorMap = Map<string, Calculator>;

export class Datum {
  updatedAt: Date;
  position: Position;
  heading: Quantity<Degree>;
  speed: Quantity<Speed>;
  vario: Quantity<Speed>;

  constructor(
    updatedAt: Date,
    position: Position,
    heading: Quantity<Degree>,
    speed: Quantity<Speed>,
    vario: Quantity<Speed>
  ) {
    this.updatedAt = updatedAt;
    this.position = position;
    this.heading = heading;
    this.speed = speed;
    this.vario = vario;
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
    this.updateCalculators(fix);
    this.currentDatum = this.buildDatum(fix);
    this.state.update(this.currentDatum);
  }

  private updateCalculators(fix: Fix) {
    this.calculators.forEach(calculator => {
      calculator.update(fix);
    });
  }

  private buildDatum(fix: Fix) {
    return new Datum(
      fix.updatedAt,
      fix.position,
      this.currentHeading() || degrees(0),
      this.currentSpeed() || kilometersPerHour(0),
      this.currentVario() || metersPerSecond(0)
    );
  }

  private currentSpeed() {
    return this.calculators.get('speed')!.getValue() as Quantity<Speed> | null;
  }

  private currentVario() {
    return this.calculators.get('vario')!.getValue() as Quantity<Speed> | null;
  }

  private currentHeading() {
    return this.calculators.get('heading')!.getValue() as Quantity<
      Angle
    > | null;
  }
}
