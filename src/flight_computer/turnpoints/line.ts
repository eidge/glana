import { Length } from '../../units/length';
import Quantity from '../../units/quantity';
import { Angle } from '../../units/angle';
import Position from '../position';

export default class Line {
  center: Position;
  rotate: Quantity<Angle>;
  length: Quantity<Length>;

  constructor(
    center: Position,
    length: Quantity<Length>,
    rotate: Quantity<Angle>
  ) {
    this.center = center;
    this.length = length;
    this.rotate = rotate;
  }

  isCrossing(lastPosition: Position, position: Position) {
    // FIXME: Implement this
    //
    // line defined by this object & lastPosition->Position intersect in the
    // right direction.
    return !!(lastPosition && position);
  }
}
