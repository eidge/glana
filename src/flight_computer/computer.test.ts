import FlightComputer, { Datum } from './computer';
import Fix from './fix';

const dummyFix = new Fix(new Date(), 1, 2, 3);

describe('FlightComputer', () => {
  describe('#update', () => {
    let computer: FlightComputer;

    beforeEach(done => {
      computer = new FlightComputer();
      done();
    });

    it('updates task position', () => {
      let receivedDatum: Datum | null = null;
      let task = {
        update(datum: Datum) {
          receivedDatum = datum;
        },
      };
      computer.setTask(task);
      computer.update(dummyFix);
      expect(receivedDatum!.position.latitude.value).toEqual(1);
      expect(receivedDatum!.position.longitude.value).toEqual(2);
      expect(receivedDatum!.position.altitude.value).toEqual(3);
    });

    it('does not crash if there is no task', () => {
      expect(() => computer.update(dummyFix)).not.toThrow();
    });
  });
});
