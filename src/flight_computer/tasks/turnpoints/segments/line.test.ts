import Position from 'flight_computer/position';
import { degrees } from 'units/angle';
import { meters } from 'units/length';
import Line from './line';

describe('Line', () => {
  describe('#rotate', () => {
    let line: Line;
    let center = new Position(degrees(40.203314), degrees(-8.410257));

    beforeEach(done => {
      line = new Line(center, meters(100));
      done();
    });

    it('is E<->W with 0 degrees rotation', () => {
      line.rotate(degrees(0));
      let lineHeading = line.startPosition.heading2DTo(line.endPosition);
      expect(lineHeading).toEqual(degrees(90));
    });

    it('is N<->S with 90 degrees rotation', () => {
      line.rotate(degrees(90));
      let lineHeading = line.startPosition.heading2DTo(line.endPosition);
      expect(lineHeading).toEqual(degrees(180));
    });

    it('is idempotent', () => {
      line.rotate(degrees(90));
      let lineHeading = line.startPosition.heading2DTo(line.endPosition);
      expect(lineHeading).toEqual(degrees(180));

      line.rotate(degrees(90));
      lineHeading = line.startPosition.heading2DTo(line.endPosition);
      expect(lineHeading).toEqual(degrees(180));
    });

    it('is reversible', () => {
      line.rotate(degrees(90));
      let lineHeading = line.startPosition.heading2DTo(line.endPosition);
      expect(lineHeading).toEqual(degrees(180));

      line.rotate(degrees(0));
      lineHeading = line.startPosition.heading2DTo(line.endPosition);
      expect(lineHeading).toEqual(degrees(90));
    });
  });

  describe('#isCrossing', () => {
    describe('no rotation', () => {
      let line: Line;
      let center = new Position(degrees(40.203314), degrees(-8.410257));

      beforeEach(done => {
        line = new Line(center, meters(100));
        done();
      });

      it('returns false if line was not crossed', () => {
        let p1 = center.move(meters(0.1), degrees(0));
        let p2 = center.move(meters(0.2), degrees(0));
        expect(line.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns false for parallel line', () => {
        let p1 = center.move(meters(0.1), degrees(0));
        let p2 = p1.move(meters(1000), degrees(90));
        expect(line.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if line is touched', () => {
        let p1 = center.move(meters(-0.1), degrees(0));
        expect(line.isCrossing(p1, center)).toBeTruthy();
      });

      it('returns true if line is crossed', () => {
        let p1 = center.move(meters(50), degrees(180));
        let p2 = center.move(meters(50), degrees(0));
        expect(line.isCrossing(p1, p2)).toBeTruthy();
      });
    });

    describe('45 degrees rotation', () => {
      let line: Line;
      let center = new Position(degrees(40.203314), degrees(-8.410257));

      beforeEach(done => {
        line = new Line(center, meters(100));
        line.rotate(degrees(45));
        done();
      });

      it('returns false if line was not crossed', () => {
        let p1 = center.move(meters(0.1), degrees(0));
        let p2 = center.move(meters(0.2), degrees(0));
        expect(line.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns false for parallel line', () => {
        let p1 = center.move(meters(0.1), degrees(0));
        let p2 = p1.move(meters(1000), degrees(90));
        expect(line.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if line is touched', () => {
        let p1 = center.move(meters(0.001), degrees(0));
        let p2 = center.move(meters(0.001), degrees(270));
        expect(line.isCrossing(p1, p2)).toBeTruthy();
      });

      it('returns true if line is crossed', () => {
        let p1 = center.move(meters(50), degrees(180));
        let p2 = center.move(meters(50), degrees(0));
        expect(line.isCrossing(p1, p2)).toBeTruthy();
      });
    });

    describe('90 degrees rotation', () => {
      let line: Line;
      let center = new Position(degrees(40.203314), degrees(-8.410257));

      beforeEach(done => {
        line = new Line(center, meters(100));
        line.rotate(degrees(90));
        done();
      });

      it('returns false if line was not crossed', () => {
        let p1 = center.move(meters(0.1), degrees(90));
        let p2 = center.move(meters(0.2), degrees(90));
        expect(line.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns false for parallel line', () => {
        let p1 = center.move(meters(0.1), degrees(90));
        let p2 = p1.move(meters(1000), degrees(180));
        expect(line.isCrossing(p1, p2)).toBeFalsy();
      });

      it('returns true if line is touched', () => {
        let p1 = center.move(meters(-0.1), degrees(0));
        expect(line.isCrossing(p1, center)).toBeTruthy();
      });

      it('returns true if line is crossed', () => {
        let p1 = center.move(meters(50), degrees(90));
        let p2 = center.move(meters(50), degrees(270));
        expect(line.isCrossing(p1, p2)).toBeTruthy();
      });
    });
  });
});
