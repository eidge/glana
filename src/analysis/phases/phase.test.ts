import Phase from './phase';
import { GliderState } from 'flight_computer/state_machine';
import SavedFlight from 'saved_flight';

class TestPhase extends Phase {
  type: GliderState = 'thermalling';
}

const savedFlight = new SavedFlight([]);

describe('Phase', () => {
  describe('split', () => {
    describe('first flight phase', () => {
      let phase = new TestPhase(savedFlight, 0, 20);

      it('returns two phases', () => {
        const [p1, p2] = phase.splitAtIndex(10);

        expect(p1!.startIndex).toEqual(0);
        expect(p1!.endIndex).toEqual(9);

        expect(p2!.startIndex).toEqual(10);
        expect(p2!.endIndex).toEqual(20);
      });

      it('spliting at first index has no left phase', () => {
        const [p1, p2] = phase.splitAtIndex(0);
        expect(p1).toBeNull();
        expect(p2).toEqual(phase);
      });

      it('spliting at last index has no right phase', () => {
        const [p1, p2] = phase.splitAtIndex(20);
        expect(p1).toEqual(phase);
        expect(p2).toBeNull();
      });
    });

    describe('middle flight phase', () => {
      let phase = new TestPhase(savedFlight, 10, 30);

      it('returns two phases', () => {
        const [p1, p2] = phase.splitAtIndex(20);

        expect(p1!.startIndex).toEqual(10);
        expect(p1!.endIndex).toEqual(19);

        expect(p2!.startIndex).toEqual(20);
        expect(p2!.endIndex).toEqual(30);
      });

      it('spliting at last index has no left phase', () => {
        const [p1, p2] = phase.splitAtIndex(10);
        expect(p1).toBeNull();
        expect(p2).toEqual(phase);
      });

      it('spliting at last index has no right phase', () => {
        const [p1, p2] = phase.splitAtIndex(30);
        expect(p1).toEqual(phase);
        expect(p2).toBeNull();
      });
    });
  });
});
