import Phase from './phase';
import { GliderState } from '../../flight_computer/state_machine';
import { dimensionless } from '../../units/dimensionless';
import { meters, Meter } from '../../units/length';
import { Speed, metersPerSecond } from '../../units/speed';
import Quantity from 'units/quantity';

export default class Glide extends Phase {
  type: GliderState = 'gliding';

  private cachedDistance?: Quantity<Meter>;

  get glideAngle() {
    if (this.distance.value === 0) return dimensionless(0);

    const altitudeDelta = this.firstDatum.position.altitude.subtract(
      this.lastDatum.position.altitude
    );
    return dimensionless(
      this.distance.convertTo(meters).value /
        altitudeDelta.convertTo(meters).value
    );
  }

  get distance() {
    if (this.cachedDistance) return this.cachedDistance;
    this.cachedDistance = this.calculateDistance();
    return this.cachedDistance;
  }

  private calculateDistance() {
    let previousDatum = this.datums[0];
    return this.datums.slice(1).reduce((totalDistance, datum) => {
      const distanceToPrevious = datum.position.distance2DTo(
        previousDatum.position
      );
      previousDatum = datum;
      return totalDistance.add(distanceToPrevious);
    }, meters(0));
  }

  get speed() {
    if (this.duration.value === 0) return metersPerSecond(0);
    return Speed.create(this.distance, this.duration);
  }
}
