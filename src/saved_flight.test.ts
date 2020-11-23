import FixFactory from '../test/support/fix_factory';
import SavedFlight from './saved_flight';
import { minutes } from './units/duration';

const startTime = new Date(1594898825139);

describe('SavedFlight', () => {
  let fixFactory: FixFactory;

  beforeEach(done => {
    fixFactory = new FixFactory({
      tickSizeInSeconds: 5,
      startTime: startTime,
    });
    done();
  });

  describe('getDatums()', () => {
    let savedFlight: SavedFlight;

    beforeEach(done => {
      let fixes = fixFactory.nextFixes(5);
      savedFlight = new SavedFlight(fixes);
      savedFlight.analise();
      done();
    });

    it('returns datums', () => {
      expect(savedFlight.getDatums().map(d => d.timestamp)).toEqual([
        new Date('2020-07-16T11:27:05.139Z'),
        new Date('2020-07-16T11:27:10.139Z'),
        new Date('2020-07-16T11:27:15.139Z'),
        new Date('2020-07-16T11:27:20.139Z'),
        new Date('2020-07-16T11:27:25.139Z'),
      ]);
    });

    it('returns datums offset in time', () => {
      savedFlight.setTimeOffset(minutes(60));
      expect(savedFlight.getDatums().map(d => d.timestamp)).toEqual([
        new Date('2020-07-16T12:27:05.139Z'),
        new Date('2020-07-16T12:27:10.139Z'),
        new Date('2020-07-16T12:27:15.139Z'),
        new Date('2020-07-16T12:27:20.139Z'),
        new Date('2020-07-16T12:27:25.139Z'),
      ]);
    });

    it('reverts datum offset', () => {
      savedFlight.setTimeOffset(minutes(60));
      expect(savedFlight.getDatums().map(d => d.timestamp)).toEqual([
        new Date('2020-07-16T12:27:05.139Z'),
        new Date('2020-07-16T12:27:10.139Z'),
        new Date('2020-07-16T12:27:15.139Z'),
        new Date('2020-07-16T12:27:20.139Z'),
        new Date('2020-07-16T12:27:25.139Z'),
      ]);

      savedFlight.setTimeOffset(minutes(0));
      expect(savedFlight.getDatums().map(d => d.timestamp)).toEqual([
        new Date('2020-07-16T11:27:05.139Z'),
        new Date('2020-07-16T11:27:10.139Z'),
        new Date('2020-07-16T11:27:15.139Z'),
        new Date('2020-07-16T11:27:20.139Z'),
        new Date('2020-07-16T11:27:25.139Z'),
      ]);
    });
  });

  describe('phaseAt()', () => {
    let savedFlight: SavedFlight;

    beforeEach(done => {
      let fixes = fixFactory.nextFixes(5);
      savedFlight = new SavedFlight(fixes);
      savedFlight.analise();
      done();
    });

    it('returns phase at given timestamp', () => {
      let phase = savedFlight.phaseAt(new Date('2020-07-16T11:27:05.140Z'));
      expect(phase!.startAt).toEqual(new Date('2020-07-16T11:27:05.139Z'));
      expect(phase!.finishAt).toEqual(new Date('2020-07-16T11:27:25.139Z'));
    });

    it('returns phase offset in time', () => {
      savedFlight.setTimeOffset(minutes(60));
      let phase = savedFlight.phaseAt(new Date('2020-07-16T12:27:05.140Z'));
      expect(phase!.startAt).toEqual(new Date('2020-07-16T12:27:05.139Z'));
      expect(phase!.finishAt).toEqual(new Date('2020-07-16T12:27:25.139Z'));
    });

    it('reverts phase offset', () => {
      savedFlight.setTimeOffset(minutes(60));
      let phase = savedFlight.phaseAt(new Date('2020-07-16T12:27:05.140Z'));
      expect(phase!.startAt).toEqual(new Date('2020-07-16T12:27:05.139Z'));
      expect(phase!.finishAt).toEqual(new Date('2020-07-16T12:27:25.139Z'));

      savedFlight.setTimeOffset(minutes(0));
      phase = savedFlight.phaseAt(new Date('2020-07-16T11:27:05.140Z'));
      expect(phase!.startAt).toEqual(new Date('2020-07-16T11:27:05.139Z'));
      expect(phase!.finishAt).toEqual(new Date('2020-07-16T11:27:25.139Z'));
    });
  });

  describe('datumAt()', () => {
    function createSavedFlight(length: number) {
      let fixes = fixFactory.nextFixes(length);
      let savedFlight = new SavedFlight(fixes);
      return savedFlight.analise();
    }

    function secondsAfterStartTime(nSeconds: number) {
      return new Date(startTime.getTime() + nSeconds * 1000);
    }

    it('returns null if given timestamp is before first datum', () => {
      let sv = createSavedFlight(5);
      expect(sv.datumAt(secondsAfterStartTime(-10))).toEqual(null);
    });

    it('returns first datum', () => {
      let sv = createSavedFlight(5);
      expect(sv.datumAt(secondsAfterStartTime(0))?.timestamp).toEqual(
        sv.getDatums()[0].timestamp
      );
    });

    it('returns first datum for timestamps between first and second datum', () => {
      let sv = createSavedFlight(5);
      expect(sv.datumAt(secondsAfterStartTime(0.01))).toEqual(
        sv.getDatums()[0]
      );
      expect(sv.datumAt(secondsAfterStartTime(0.2))).toEqual(sv.getDatums()[0]);
      expect(sv.datumAt(secondsAfterStartTime(1))).toEqual(sv.getDatums()[0]);
      expect(sv.datumAt(secondsAfterStartTime(4))).toEqual(sv.getDatums()[0]);
      expect(sv.datumAt(secondsAfterStartTime(4.999999))).toEqual(
        sv.getDatums()[0]
      );
      expect(sv.datumAt(secondsAfterStartTime(5))).toEqual(sv.getDatums()[1]);
    });

    it('returns middle datums', () => {
      let sv = createSavedFlight(5);
      expect(sv.datumAt(secondsAfterStartTime(10))).toEqual(sv.getDatums()[2]);
    });

    it('returns last datum', () => {
      let sv = createSavedFlight(5);
      expect(sv.datumAt(secondsAfterStartTime(20))).toEqual(sv.getDatums()[4]);
    });

    it('works correctly for even numbers of datums', () => {
      let sv = createSavedFlight(10);
      let datums = sv.getDatums();
      expect(sv.datumAt(secondsAfterStartTime(0.1))).toEqual(datums[0]);
      expect(sv.datumAt(secondsAfterStartTime(5.1))).toEqual(datums[1]);
      expect(sv.datumAt(secondsAfterStartTime(10.1))).toEqual(datums[2]);
      expect(sv.datumAt(secondsAfterStartTime(15.1))).toEqual(datums[3]);
      expect(sv.datumAt(secondsAfterStartTime(20.1))).toEqual(datums[4]);
      expect(sv.datumAt(secondsAfterStartTime(25.1))).toEqual(datums[5]);
      expect(sv.datumAt(secondsAfterStartTime(30.1))).toEqual(datums[6]);
      expect(sv.datumAt(secondsAfterStartTime(35.1))).toEqual(datums[7]);
      expect(sv.datumAt(secondsAfterStartTime(40.1))).toEqual(datums[8]);
      expect(sv.datumAt(secondsAfterStartTime(45.0))).toEqual(datums[9]);
      expect(sv.datumAt(secondsAfterStartTime(45.1))).toEqual(null);
    });

    it('works correctly for uneven numbers of datums', () => {
      let sv = createSavedFlight(9);
      let datums = sv.getDatums();
      expect(sv.datumAt(secondsAfterStartTime(0.1))).toEqual(datums[0]);
      expect(sv.datumAt(secondsAfterStartTime(5.1))).toEqual(datums[1]);
      expect(sv.datumAt(secondsAfterStartTime(10.1))).toEqual(datums[2]);
      expect(sv.datumAt(secondsAfterStartTime(15.1))).toEqual(datums[3]);
      expect(sv.datumAt(secondsAfterStartTime(20.1))).toEqual(datums[4]);
      expect(sv.datumAt(secondsAfterStartTime(25.1))).toEqual(datums[5]);
      expect(sv.datumAt(secondsAfterStartTime(30.1))).toEqual(datums[6]);
      expect(sv.datumAt(secondsAfterStartTime(35.1))).toEqual(datums[7]);
      expect(sv.datumAt(secondsAfterStartTime(40.0))).toEqual(datums[8]);
      expect(sv.datumAt(secondsAfterStartTime(40.1))).toEqual(null);
    });
  });
});
