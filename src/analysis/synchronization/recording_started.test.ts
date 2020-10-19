import FlightGroup from 'analysis/flight_group';
import SavedFlight from 'saved_flight';
import FixFactory from '../../../test/support/fix_factory';
import RecordingStarted from './recording_started';

describe('RecordingStarted', () => {
  describe('synchronize()', () => {
    let flightGroup: FlightGroup;
    let recordingStarted = new RecordingStarted();

    beforeEach(done => {
      let fixFactory = new FixFactory({
        tickSizeInSeconds: 5,
        startTime: new Date(1594898825139),
      });
      let earliestFlight = new SavedFlight(fixFactory.nextFixes(5));
      let middleFlight = new SavedFlight(fixFactory.nextFixes(10));
      let lastFlight = new SavedFlight(fixFactory.nextFixes(5));
      flightGroup = new FlightGroup([middleFlight, earliestFlight, lastFlight]);
      done();
    });

    it('starts all flights at the same time', () => {
      recordingStarted.synchronize(flightGroup.flights);
      flightGroup.flights.forEach(flight => {
        expect(flight.getDatums()[0].timestamp).toEqual(
          new Date(1594898825139)
        );
      });
    });

    it('syncs flights to to the flight that started the earliest', () => {
      recordingStarted.synchronize(flightGroup.flights);
      flightGroup.flights.forEach(flight => {
        expect(flight.getDatums()[0].timestamp).toEqual(
          flightGroup.flights[1].getDatums()[0].timestamp
        );
      });
    });

    it('is idempotent', () => {
      recordingStarted.synchronize(flightGroup.flights);
      recordingStarted.synchronize(flightGroup.flights);
      flightGroup.flights.forEach(flight => {
        expect(flight.getDatums()[0].timestamp).toEqual(
          new Date(1594898825139)
        );
      });
    });
  });
});
