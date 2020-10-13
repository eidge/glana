import FixFactory from '../test/support/fix_factory';
import SavedFlight from './saved_flight';
import { minutes } from './units/duration';

describe('SavedFlight', () => {
  let fixFactory: FixFactory;

  beforeEach(done => {
    fixFactory = new FixFactory({
      tickSizeInSeconds: 5,
      startTime: new Date(1594898825139),
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
});
