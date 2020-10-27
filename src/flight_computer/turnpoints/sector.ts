import { Length } from '../../units/length';
import Quantity from '../../units/quantity';
import { Angle } from '../../units/angle';
import Position from '../position';

export default class Sector {
  radius: Quantity<Length>;
  angle: Quantity<Angle>;
  rotate: Quantity<Angle>;
  center: Position;

  constructor(
    center: Position,
    radius: Quantity<Length>,
    angle: Quantity<Angle>,
    rotate: Quantity<Angle>
  ) {
    this.center = center;
    this.radius = radius;
    this.angle = angle;
    this.rotate = rotate;
  }

  isCrossing(lastPosition: Position, position: Position) {
    // FIXME: Implement this
    //
    // Don't need the last position, algo is:
    // distance(position, center) < radius && angle(position, center) < angle+rotate
    return !!(lastPosition && position);
  }
}
