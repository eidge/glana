import Calculator from './calculator';
import { Degree, degrees } from '../../units/angle';
import Quantity from '../../units/quantity';
import Fix from '../fix';
import Position from '../position';
import { Datum } from 'flight_computer/computer';

class Heading extends Calculator {
  heading: Quantity<Degree> | null = null;
  lastPosition: Position | null = null;

  name(): string {
    return 'Heading';
  }

  update(fix: Fix, _previousDatum: Datum): void {
    if (!this.lastPosition) {
      this.lastPosition = fix.position;
      this.heading = degrees(0);
      return;
    }
    this.heading = this.lastPosition.heading2DTo(fix.position);
    this.lastPosition = fix.position;
  }

  getValue() {
    return this.heading;
  }
}

export default Heading;
