import SavedFlight from '../../saved_flight';
import AbstractFlightSynchronizer from './abstract_flight_synchronizer';

export default class RecordingStarted extends AbstractFlightSynchronizer {
  protected referenceTimeWithoutOffset(flight: SavedFlight) {
    return flight.getRecordingStartedAt(true);
  }
}
