import { Length, meters } from '../../units/length';
import Quantity from '../../units/quantity';
import { Angle, degrees } from '../../units/angle';
import Position from '../position';
import { intersectsLine } from '../../math/geo';

export default class Line {
  center: Position;
  rotationAngle: Quantity<Angle> = degrees(0);
  length: Quantity<Length>;

  startPosition!: Position;
  endPosition!: Position;

  constructor(center: Position, length: Quantity<Length>) {
    this.center = center;
    this.length = length.convertTo(meters);
    this.rotate(this.rotationAngle);
  }

  rotate(angle: Quantity<Angle>) {
    let defaultRotation = degrees(90);
    this.rotationAngle = angle;
    this.startPosition = this.center.move(
      this.length.divide(2),
      this.rotationAngle.add(defaultRotation).add(degrees(180))
    );
    this.endPosition = this.center.move(
      this.length.divide(2),
      this.rotationAngle.add(defaultRotation)
    );
  }

  isCrossing(lastPosition: Position, position: Position) {
    return intersectsLine(
      [this.startPosition, this.endPosition],
      [lastPosition, position]
    );
  }
}
