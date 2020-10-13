import DatumFactory from './datum_factory';
import { Duration } from '../../src/units/duration';
import Quantity from '../../src/units/quantity';
import { Degree } from '../../src/units/angle';
import { Speed } from '../../src/units/speed';

export default class FixFactory {
  private datumFactory: DatumFactory;

  constructor(...args: any) {
    this.datumFactory = new DatumFactory(...args);
  }

  nextFix() {
    let datum = this.datumFactory.nextDatum();
    return datum.toFix();
  }

  nextFixes(count: number) {
    let datums = this.datumFactory.nextDatums(count);
    return datums.map(d => d.toFix());
  }

  advanceTime(delta: Quantity<Duration>) {
    return this.datumFactory.advanceTime(delta);
  }

  turnLeft(degrees: Quantity<Degree>) {
    return this.datumFactory.turnLeft(degrees);
  }

  turnRight(degrees: Quantity<Degree>) {
    return this.datumFactory.turnRight(degrees);
  }

  setSpeed(speed: Quantity<Speed>) {
    return this.datumFactory.setSpeed(speed);
  }
}
