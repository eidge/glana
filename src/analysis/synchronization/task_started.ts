import SavedFlight from '../../saved_flight';
import AbstractFlightSynchronizer from './abstract_flight_synchronizer';

export default class TaskStarted extends AbstractFlightSynchronizer {
  protected referenceTimeWithoutOffset(flight: SavedFlight) {
    return flight.getTaskStartedAt(true) || flight.getRecordingStartedAt(true);
  }
}
