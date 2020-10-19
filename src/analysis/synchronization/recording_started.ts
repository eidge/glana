import SynchronizationMethod from './method';
import SavedFlight from '../../saved_flight';
import { milliseconds } from '../../units/duration';

export default class RecordingStarted implements SynchronizationMethod {
  synchronize(flights: SavedFlight[]) {
    this.resetOffsets(flights);
    this.synchronizeByFirstFix(flights);
  }

  private resetOffsets(flights: SavedFlight[]) {
    flights.forEach(f => f.setTimeOffset(milliseconds(0)));
  }

  private synchronizeByFirstFix(flights: SavedFlight[]) {
    let referenceTime = this.earliestFirstFix(flights);
    flights.forEach(flight => {
      let startedRecordingAt = flight.getDatums()[0].timestamp;
      let offsetMillis = referenceTime.getTime() - startedRecordingAt.getTime();
      flight.setTimeOffset(milliseconds(offsetMillis));
    });
  }

  private earliestFirstFix(flights: SavedFlight[]) {
    return flights.map(f => f.getDatums()[0].timestamp).sort()[0];
  }
}
