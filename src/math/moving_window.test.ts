import MovingWindow from './moving_window';
import { seconds } from '../units/duration';
import { kilometersPerHour } from '../units/speed';
import { secondsAgo } from '../../test/support/time_helpers';

describe('MovingWindow', () => {
  describe('addValue', () => {
    it('adds values within the time window', () => {
      let mw = new MovingWindow(seconds(30), kilometersPerHour.unit);
      let p1 = { timestamp: secondsAgo(30), value: kilometersPerHour(119) };
      let p2 = { timestamp: secondsAgo(20), value: kilometersPerHour(120) };
      let p3 = { timestamp: secondsAgo(0), value: kilometersPerHour(121) };

      mw.addValue(p1);
      mw.addValue(p2);
      mw.addValue(p3);

      expect(mw.values).toEqual([p1, p2, p3]);
    });

    it('ignores datapoint older than the newest data point in the window', () => {
      let mw = new MovingWindow(seconds(30), kilometersPerHour.unit);
      let p1 = { timestamp: secondsAgo(31), value: kilometersPerHour(119) };
      let p2 = { timestamp: secondsAgo(20), value: kilometersPerHour(120) };
      let p3 = { timestamp: secondsAgo(21), value: kilometersPerHour(121) };

      mw.addValue(p1);
      mw.addValue(p2);
      mw.addValue(p3);

      expect(mw.values).toEqual([p1, p2]);
    });

    it('removes old values', () => {
      let mw = new MovingWindow(seconds(30), kilometersPerHour.unit);
      let p1 = { timestamp: secondsAgo(31), value: kilometersPerHour(119) };
      let p2 = { timestamp: secondsAgo(20), value: kilometersPerHour(120) };
      let p3 = { timestamp: secondsAgo(0), value: kilometersPerHour(121) };

      mw.addValue(p1);
      mw.addValue(p2);
      mw.addValue(p3);

      expect(mw.values).toEqual([p2, p3]);
    });

    it('accepts datapoints for the same timestamp', () => {
      let mw = new MovingWindow(seconds(30), kilometersPerHour.unit);

      let timestamp = secondsAgo(45);

      let p1 = { timestamp: timestamp, value: kilometersPerHour(119) };
      let p2 = { timestamp: timestamp, value: kilometersPerHour(120) };

      mw.addValue(p1);
      mw.addValue(p2);

      expect(mw.values).toEqual([p1, p2]);
    });
  });

  describe('average', () => {
    it('returns zero when window is empty', () => {
      let mw = new MovingWindow(seconds(30), kilometersPerHour.unit);
      expect(mw.average().equals(kilometersPerHour(0))).toBeTruthy();
    });

    it('returns average value in window', () => {
      let mw = new MovingWindow(seconds(30), kilometersPerHour.unit);
      mw.addValue({ timestamp: secondsAgo(20), value: kilometersPerHour(119) });
      mw.addValue({ timestamp: secondsAgo(15), value: kilometersPerHour(120) });
      mw.addValue({ timestamp: secondsAgo(10), value: kilometersPerHour(121) });
      expect(mw.average()).toEqual(kilometersPerHour(120));
    });
  });
});
