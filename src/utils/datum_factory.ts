import Position from '../../src/flight_computer/position';
import { Datum } from '../../src/flight_computer/computer';
import {
  kilometersPerHour,
  Speed,
  metersPerSecond,
} from '../../src/units/speed';
import Quantity from '../../src/units/quantity';
import { degrees, Degree } from '../../src/units/angle';
import {
  Duration,
  milliseconds,
  seconds,
  Second,
} from '../../src/units/duration';
import { meters } from '../../src/units/length';
import { GliderState } from 'flight_computer/state_machine';

interface DatumFactoryOptions {
  startTime?: Date;
  tickSizeInSeconds?: number;
}

export default class DatumFactory {
  private currentTime: Date;
  private lastTickAt: Date;
  private tick: Quantity<Second>;
  private position: Position;
  private speed: Quantity<Speed>;
  private heading: Quantity<Degree>;
  private vario: Quantity<Speed>;
  private datum!: Datum;
  private gliderState: GliderState = 'gliding';

  constructor(options: DatumFactoryOptions = {}) {
    this.currentTime = options.startTime || new Date();
    this.lastTickAt = this.currentTime;
    this.tick = seconds(options.tickSizeInSeconds || 5);
    this.position = new Position(degrees(0), degrees(0), degrees(0));
    this.heading = degrees(0);
    this.speed = kilometersPerHour(120);
    this.vario = metersPerSecond(0);
  }

  nextDatum() {
    this.calculatePosition();

    this.datum = new Datum(
      this.currentTime,
      this.position,
      this.heading,
      this.speed,
      this.vario,
      this.gliderState
    );

    this.advanceTime(this.tick);

    return this.datum;
  }

  private calculatePosition() {
    if (this.lastTickAt === this.currentTime) return;

    let delta = milliseconds(
      this.currentTime.getTime() - this.lastTickAt.getTime()
    );
    let distanceCovered = meters(
      this.speed.convertTo(metersPerSecond).value *
        delta.convertTo(seconds).value
    );
    let altitudeDelta = meters(
      this.vario.convertTo(metersPerSecond).value *
        delta.convertTo(seconds).value
    );

    this.position = this.position.move(
      distanceCovered,
      this.heading,
      altitudeDelta
    );
    this.lastTickAt = this.currentTime;
  }

  nextDatums(count: number) {
    let datums: Datum[] = [];
    for (let i = 0; i < count; ++i) {
      datums.push(this.nextDatum());
    }
    return datums;
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

  setVario(vario: Quantity<Speed>) {
    this.vario = vario;
    return this;
  }
}
