import SavedFlight from '../../saved_flight';
import AbstractFlightSynchronizer from './abstract_flight_synchronizer';

export default class TakeOff extends AbstractFlightSynchronizer {
  protected referenceTimeWithoutOffset(flight: SavedFlight) {
    return flight.getTakeoffAt(true) || flight.getRecordingStartedAt(true);
  }
}
