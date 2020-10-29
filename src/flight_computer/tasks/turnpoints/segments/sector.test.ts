import Position from 'flight_computer/position';
import { degrees } from 'units/angle';
import Sector from './sector';
import { meters } from 'units/length';

let unusedPosition = new Position(degrees(0), degrees(0));

describe('Sector', () => {
  describe('#rotate', () => {
    let sector: Sector;
    let center = new Position(degrees(40.203314), degrees(-8.410257));

    beforeEach(done => {
      sector = new Sector(center, meters(100), degrees(180));
      done();
    });

    it('is N<->S with 0 degrees rotation', () => {
      sector.rotate(degrees(0));
      expect(sector.startAngle).toEqual(degrees(270));
      expect(sector.endAngle).toEqual(degrees(90));
    });

    it('is N<->S with 90 degrees rotation', () => {
      sector.rotate(degrees(90));
      expect(sector.startAngle).toEqual(degrees(0));
      expect(sector.endAngle).toEqual(degrees(180));
    });

    it('is idempotent', () => {
      sector.rotate(degrees(90));
      expect(sector.startAngle).toEqual(degrees(0));
      expect(sector.endAngle).toEqual(degrees(180));

      sector.rotate(degrees(90));
      expect(sector.startAngle).toEqual(degrees(0));
      expect(sector.endAngle).toEqual(degrees(180));
    });

    it('is reversible', () => {
      sector.rotate(degrees(90));
      expect(sector.startAngle).toEqual(degrees(0));
      expect(sector.endAngle).toEqual(degrees(180));

      sector.rotate(degrees(0));
      expect(sector.startAngle).toEqual(degrees(270));
      expect(sector.endAngle).toEqual(degrees(90));
    });
  });

  describe('#isCrossing', () => {
    describe('circles', () => {
      it('returns true when the point is inside', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(360));
        let position = center;

        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(50), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(50), degrees(90));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(50), degrees(180));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(50), degrees(275));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(99), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(1), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();
      });

      it('returns true when the point is on the circumference', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(360));

        let position = center.move(meters(100), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(100), degrees(90));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(100), degrees(180));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(99.9999999), degrees(275));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();
      });

      it('is not impacted by rotation', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let position = center.move(meters(100), degrees(32));

        let sector = new Sector(center, meters(100), degrees(360));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        sector = new Sector(center, meters(100), degrees(360));
        sector.rotate(degrees(84));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        sector = new Sector(center, meters(100), degrees(360));
        sector.rotate(degrees(182));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        sector = new Sector(center, meters(100), degrees(360));
        sector.rotate(degrees(279));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();
      });

      it('returns false when the point is outside', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(360));
        let position = center;

        position = center.move(meters(101), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(1000), degrees(90));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(102), degrees(180));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(1000000), degrees(275));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(103), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(150), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();
      });
    });

    describe('90 degree sector, no rotation', () => {
      it('returns true when the point is inside', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(90));

        let position = center;
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(10), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(99.9999), degrees(44.99999));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(10), degrees(-44.99999));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();
      });

      it('returns false when the point is outside', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(90));
        let position = center;

        position = center.move(meters(101), degrees(0));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(10), degrees(46));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(10), degrees(-46));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(45), degrees(180));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();
      });
    });

    describe('90 degree sector, 90 degree rotation', () => {
      it('returns true when the point is inside', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(90));
        sector.rotate(degrees(90));

        let position = center;
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(10), degrees(90));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(99.9999), degrees(45));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();

        position = center.move(meters(10), degrees(90 + 44.99999));
        expect(sector.isCrossing(unusedPosition, position)).toBeTruthy();
      });

      it('returns false when the point is outside', () => {
        let center = new Position(degrees(40.203314), degrees(-8.410257));
        let sector = new Sector(center, meters(100), degrees(90));
        sector.rotate(degrees(90));
        let position = center;

        position = center.move(meters(100.1), degrees(90));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(20), degrees(44.9));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();

        position = center.move(meters(10), degrees(90 + 45.1));
        expect(sector.isCrossing(unusedPosition, position)).toBeFalsy();
      });
    });
  });
});
