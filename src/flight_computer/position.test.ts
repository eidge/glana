import Position from './position';
import { kilometers } from 'units/length';
import { degrees } from 'units/angle';

describe('Position', () => {
  describe('#distance2DTo', () => {
    it('returns distance across two points', () => {
      const lisbon = new Position(degrees(38.736946), degrees(-9.142685));
      const coimbra = new Position(degrees(40.203314), degrees(-8.410257));
      expect(
        lisbon.distance2DTo(coimbra).equals(kilometers(174.94740000000002))
      ).toBeTruthy();
    });

    it('returns zero when measuring distance to itself', () => {
      const lisbon = new Position(degrees(38.736946), degrees(-9.142685));
      expect(lisbon.distance2DTo(lisbon).equals(kilometers(0))).toBeTruthy();
    });
  });

  describe('#heading2DTo', () => {
    it('returns 0 when measuring and heading to itself', () => {
      let pos1 = new Position(degrees(40), degrees(-8));
      expect(pos1.heading2DTo(pos1)).toEqual(degrees(0));
    });

    it('returns correct headings', () => {
      let pos1 = new Position(degrees(40), degrees(-8));
      let pos2 = new Position(degrees(41), degrees(-8));

      expect(pos1.heading2DTo(pos2)).toEqual(degrees(0));
      expect(pos2.heading2DTo(pos1)).toEqual(degrees(180));

      pos2 = new Position(degrees(40), degrees(-7));

      expect(pos1.heading2DTo(pos2)).toEqual(degrees(90));
      expect(pos2.heading2DTo(pos1)).toEqual(degrees(270));
    });
  });
});
