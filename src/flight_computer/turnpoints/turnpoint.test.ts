import Position from 'flight_computer/position';
import { degrees, Angle } from 'units/angle';
import { meters } from 'units/length';
import Turnpoint, { TurnpointSegment } from './turnpoint';
import Quantity from 'units/quantity';

class DummySegment implements TurnpointSegment {
  crossing = false;
  rotationAngle: Quantity<Angle> = degrees(0);

  isCrossing(_lastPosition: Position, _position: Position): boolean {
    return this.crossing;
  }

  rotate(angle: Quantity<Angle>) {
    this.rotationAngle = angle;
  }
}

describe('Sector', () => {
  describe('#rotate', () => {
    let segment1 = new DummySegment();
    let segment2 = new DummySegment();

    beforeEach(done => {
      segment1.rotate(degrees(0));
      segment2.rotate(degrees(0));
      done();
    });

    it('rotates single segment turnpoint', () => {
      let tp = new Turnpoint('ABC', [segment1]);
      tp.rotate(degrees(90));
      expect(segment1.rotationAngle).toEqual(degrees(90));
    });

    it('rotates multiple segment turnpoint', () => {
      let tp = new Turnpoint('ABC', [segment1, segment2]);
      tp.rotate(degrees(90));
      expect(segment1.rotationAngle).toEqual(degrees(90));
      expect(segment2.rotationAngle).toEqual(degrees(90));
    });
  });

  describe('#isCrossing', () => {
    describe('single segment turnpoint', () => {
      let p1 = new Position(degrees(40.203314), degrees(-8.410257));
      let p2 = p1.move(meters(100), degrees(0));
      let segment = new DummySegment();
      let tp = new Turnpoint('ABC', [segment]);

      beforeEach(done => {
        segment.crossing = false;
        done();
      });

      it('returns false if segments is not being crossed', () => {
        expect(tp.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if any of segments is being crossed', () => {
        segment.crossing = true;
        expect(tp.isCrossing(p1, p2)).toBeTruthy();
      });
    });

    describe('single segment turnpoint', () => {
      let p1 = new Position(degrees(40.203314), degrees(-8.410257));
      let p2 = p1.move(meters(100), degrees(0));
      let segment1 = new DummySegment();
      let segment2 = new DummySegment();
      let tp = new Turnpoint('ABC', [segment1, segment2]);

      beforeEach(done => {
        segment1.crossing = false;
        segment2.crossing = false;
        done();
      });

      it('returns false if no segments are being crossed', () => {
        expect(tp.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if any of its segments are being crossed', () => {
        segment1.crossing = true;
        segment2.crossing = false;
        expect(tp.isCrossing(p1, p2)).toBeTruthy();

        segment1.crossing = false;
        segment2.crossing = true;
        expect(tp.isCrossing(p1, p2)).toBeTruthy();

        segment1.crossing = true;
        segment2.crossing = true;
        expect(tp.isCrossing(p1, p2)).toBeTruthy();
      });
    });
  });
});
