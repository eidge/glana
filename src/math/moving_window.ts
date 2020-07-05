import Quantity from '../units/quantity';
import Unit from '../units/unit';
import { Duration, milliseconds } from '../units/duration';

interface DataPoint<U extends Unit> {
  timestamp: Date;
  value: Quantity<U>;
}

export default class MovingWindow<U extends Unit> {
  windowSizeInMillis: number;
  values: Array<DataPoint<U>> = [];
  unit: U;

  constructor(windowDuration: Quantity<Duration>, unit: U) {
    this.windowSizeInMillis = windowDuration.convertTo(milliseconds).value;
    this.unit = unit;
  }

  addValue(datapoint: DataPoint<U>) {
    if (this.isOlderThanMostRecentValue(datapoint)) {
      throw new Error(
        'given datapoint is older than the last datapoint in the window'
      );
    }

    if (this.isTooOld(datapoint)) {
      this.values.shift();
      this.addValue(datapoint);
    } else {
      this.values.push(datapoint);
    }
  }

  private isOlderThanMostRecentValue(datapoint: DataPoint<U>) {
    const newestDataPoint = this.values[this.values.length - 1];
    if (!newestDataPoint) return false;

    return newestDataPoint.timestamp.getTime() > datapoint.timestamp.getTime();
  }

  private isTooOld(newDataPoint: DataPoint<U>) {
    const oldestDataPoint = this.values[0];
    if (!oldestDataPoint) return false;

    const oldDataPointMillis = oldestDataPoint.timestamp.getTime();
    const newDataPointMillis = newDataPoint.timestamp.getTime();
    return newDataPointMillis - oldDataPointMillis > this.windowSizeInMillis;
  }

  average() {
    const zero = new Quantity(0, this.unit);

    return this.values.reduce((average, datapoint) => {
      let pointContribution = datapoint.value.divide(this.values.length);
      return average.add(pointContribution);
    }, zero);
  }
}
