import { Datum } from './computer';
import { seconds } from '../units/duration';
import { kilometersPerHour } from '../units/speed';
import { degrees, Degree } from '../units/angle';
import MovingWindow from '../math/moving_window';
import Quantity from 'units/quantity';

export type GliderState = 'stopped' | 'gliding' | 'thermalling';

export default class StateMachine {
  state: GliderState = 'stopped';
  private speedMovingWindow2Minute = new MovingWindow(
    seconds(10),
    kilometersPerHour.unit
  );
  private speedMovingWindow = new MovingWindow(
    seconds(10),
    kilometersPerHour.unit
  );
  private headingMovingWindow = new MovingWindow(seconds(30), degrees.unit);

  isStopped() {
    return this.state === 'stopped';
  }

  isGliding() {
    return this.state === 'gliding';
  }

  isThermalling() {
    return this.state === 'thermalling';
  }

  update(datum: Datum) {
    this.updateMovingWindows(datum);

    if (this.isStopped() && this.isStartingToMove()) {
      this.state = 'gliding';
    } else if (this.isGliding() && this.isStopping()) {
      this.state = 'stopped';
    } else if (this.isGliding() && this.isStartingToTurn()) {
      this.state = 'thermalling';
    } else if (this.isThermalling() && this.isStartingToGlide()) {
      this.state = 'gliding';
    }
  }

  private updateMovingWindows(datum: Datum) {
    this.speedMovingWindow.addValue({
      timestamp: datum.updatedAt,
      value: datum.speed,
    });
    this.speedMovingWindow2Minute.addValue({
      timestamp: datum.updatedAt,
      value: datum.speed,
    });
    this.headingMovingWindow.addValue({
      timestamp: datum.updatedAt,
      value: datum.heading,
    });
  }

  private isStartingToMove() {
    return this.speedMovingWindow.average().greaterThan(kilometersPerHour(50));
  }

  private isStopping() {
    return this.speedMovingWindow2Minute
      .average()
      .lessThan(kilometersPerHour(1));
  }

  private isStartingToTurn() {
    let degreesTurned = this.degreesTurnedInWindow();

    return (
      degreesTurned.greaterThan(degrees(270)) ||
      degreesTurned.lessThan(degrees(-270))
    );
  }

  private degreesTurnedInWindow() {
    if (this.headingMovingWindow.values.length === 0) return degrees(0);

    let values = Array.from(this.headingMovingWindow.values);
    let previousHeading = values.shift()!.value;
    let degreesTurned = degrees(0);

    values.forEach(headingDp => {
      let heading = headingDp.value;
      let delta = heading.subtract(previousHeading);

      delta = this.shortestDelta(delta);
      degreesTurned = degreesTurned.add(delta);
      previousHeading = heading;
    });

    return degreesTurned;
  }

  private shortestDelta(delta: Quantity<Degree>) {
    // We assume the turn is always in the direction of the smallest angle
    // between current heading and the previous one.

    if (delta.greaterThan(degrees(180))) {
      return delta.subtract(degrees(360));
    } else if (delta.lessThan(degrees(-180))) {
      return delta.add(degrees(360));
    } else {
      return delta;
    }
  }

  isStartingToGlide() {
    let degreesTurned = this.degreesTurnedInWindow();

    return (
      degreesTurned.lessThan(degrees(220)) &&
      degreesTurned.greaterThan(degrees(-220))
    );
  }
}
