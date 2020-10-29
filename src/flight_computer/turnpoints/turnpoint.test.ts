import Position from 'flight_computer/position';
import { degrees } from 'units/angle';
import { meters } from 'units/length';
import Turnpoint, { TurnpointSegment } from './turnpoint';

class DummySegment implements TurnpointSegment {
  crossing = false;

  isCrossing(_lastPosition: Position, _position: Position): boolean {
    return this.crossing;
  }
}

describe('Sector', () => {
  describe('#isCrossing', () => {
    describe('single segment turnpoint', () => {
      it('returns false if segments is not being crossed', () => {
        let p1 = new Position(degrees(40.203314), degrees(-8.410257));
        let p2 = p1.move(meters(100), degrees(0));
        let segment = new DummySegment();
        let tp = new Turnpoint('ABC', [segment]);

        expect(tp.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if any of segments is being crossed', () => {
        let p1 = new Position(degrees(40.203314), degrees(-8.410257));
        let p2 = p1.move(meters(100), degrees(0));
        let segment = new DummySegment();
        let tp = new Turnpoint('ABC', [segment]);

        segment.crossing = true;
        expect(tp.isCrossing(p1, p2)).toBeTruthy();
      });
    });

    describe('single segment turnpoint', () => {
      it('returns false if no segments are being crossed', () => {
        let p1 = new Position(degrees(40.203314), degrees(-8.410257));
        let p2 = p1.move(meters(100), degrees(0));
        let segment1 = new DummySegment();
        let segment2 = new DummySegment();
        let tp = new Turnpoint('ABC', [segment1, segment2]);

        expect(tp.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if any of its segments are being crossed', () => {
        let p1 = new Position(degrees(40.203314), degrees(-8.410257));
        let p2 = p1.move(meters(100), degrees(0));
        let segment1 = new DummySegment();
        let segment2 = new DummySegment();
        let tp = new Turnpoint('ABC', [segment1, segment2]);

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
