import { Length, meters } from '../../../../units/length';
import Quantity from '../../../../units/quantity';
import { Angle, degrees } from '../../../../units/angle';
import Position from '../../../position';
import { TurnpointSegment } from '.././turnpoint';
import { circleGeoJSON, sectorGeoJSON } from '../../../../math/geo';

export default class Sector implements TurnpointSegment {
  radius: Quantity<Length>;
  arc: Quantity<Angle>;
  center: Position;
  rotationAngle: Quantity<Angle> = degrees(0);
  startAngle!: Quantity<Angle>;
  endAngle!: Quantity<Angle>;

  private adjustToZero!: Quantity<Angle>;
  private adjustedStartAngle!: Quantity<Angle>;
  private adjustedEndAngle!: Quantity<Angle>;

  constructor(
    center: Position,
    radius: Quantity<Length>,
    arc: Quantity<Angle>
  ) {
    this.center = center;
    this.radius = radius.convertTo(meters);
    this.arc = arc.convertTo(degrees).normalise();
    this.rotate(this.rotationAngle);
  }

  rotate(angle: Quantity<Angle>) {
    this.rotationAngle = angle;
    this.startAngle = this.rotationAngle
      .subtract(this.arc.divide(2))
      .normalise();
    this.endAngle = this.rotationAngle.add(this.arc.divide(2)).normalise();

    // We rotate all angles so that the adjustedStartAngle is zero. This simplifies the
    // math, because arc < 360, we do not have to worry about sectors where the
    // startAngle > endAngle. By rotating everything so that adjustedStartAngle = 0,
    // adjustedStartAngle will always be smaller than the adjustedEndAngle.
    this.adjustToZero = this.startAngle;
    this.adjustedStartAngle = degrees(0);
    this.adjustedEndAngle = this.endAngle.subtract(this.startAngle).normalise();
  }

  isCrossing(_lastPosition: Position, position: Position) {
    let distanceToCenter = this.center.distance2DTo(position);
    if (distanceToCenter.greaterThan(this.radius)) {
      return false;
    }

    if (this.isFullCircle() || distanceToCenter.value === 0) {
      return true;
    }

    let adjustedPositionAngle = this.center
      .heading2DTo(position)
      .subtract(this.adjustToZero)
      .normalise();

    return (
      adjustedPositionAngle.equalOrGreaterThan(this.adjustedStartAngle) &&
      adjustedPositionAngle.equalOrLessThan(this.adjustedEndAngle)
    );
  }

  toGeoJSON() {
    if (this.isFullCircle()) {
      return circleGeoJSON(this.center, this.radius);
    } else {
      return sectorGeoJSON(
        this.center,
        this.radius,
        this.startAngle,
        this.endAngle
      );
    }
  }

  private isFullCircle() {
    return this.adjustedStartAngle.equals(this.adjustedEndAngle);
  }
}
