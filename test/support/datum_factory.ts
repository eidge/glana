import Position from '../../src/flight_computer/position';
import { Datum } from '../../src/flight_computer/computer';
import {
  kilometersPerHour,
  Speed,
  metersPerSecond,
} from '../../src/units/speed';
import Quantity from '../../src/units/quantity';
import { degrees, Degree } from '../../src/units/angle';
import { Duration, milliseconds, seconds, Second } from 'units/duration';

interface DatumFactoryOptions {
  currentTime?: Date;
  tickSizeInSeconds?: number;
}

export default class DatumFactory {
  private currentTime: Date;
  private tick: Quantity<Second>;
  private position: Position;
  private speed: Quantity<Speed>;
  private heading: Quantity<Degree>;
  private vario: Quantity<Speed>;
  private datum!: Datum;

  constructor(options: DatumFactoryOptions = {}) {
    this.currentTime = options.currentTime || new Date();
    this.tick = seconds(options.tickSizeInSeconds || 5);
    this.position = new Position(degrees(0), degrees(0), degrees(0));
    this.heading = degrees(0);
    this.speed = kilometersPerHour(120);
    this.vario = metersPerSecond(0);
  }

  nextDatum() {
    this.datum = new Datum(
      this.currentTime,
      this.position,
      this.heading,
      this.speed,
      this.vario,
      'gliding'
    );

    this.nextTick();

    return this.datum;
  }

  private nextTick() {
    this.advanceTime(this.tick);
  }

  advanceTime(delta: Quantity<Duration>) {
    let millis = delta.convertTo(milliseconds).value;
    this.currentTime = new Date(this.currentTime.getTime() + millis);
    return this;
  }

  turnLeft(degrees: Quantity<Degree>) {
    this.heading = this.heading.subtract(degrees).normalise();
    return this;
  }

  turnRight(degrees: Quantity<Degree>) {
    this.heading = this.heading.add(degrees).normalise();
    return this;
  }

  setSpeed(speed: Quantity<Speed>) {
    this.speed = speed;
    return this;
  }
}
