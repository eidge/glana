import SynchronizationMethod from './method';
import SavedFlight from '../../saved_flight';
import { milliseconds } from '../../units/duration';

export default abstract class AbstractFlightSynchronizer
  implements SynchronizationMethod {
  synchronize(flights: SavedFlight[]) {
    let ealiestFixInGroup = this.earliestFirstFix(flights);
    flights.forEach(flight => {
      let referenceTime = this.referenceTimeWithoutOffset(flight);
      let offsetMillis = ealiestFixInGroup.getTime() - referenceTime.getTime();
      flight.setTimeOffset(milliseconds(offsetMillis));
    });
  }

  protected abstract referenceTimeWithoutOffset(flight: SavedFlight): Date;

  private earliestFirstFix(flights: SavedFlight[]) {
    return flights.map(f => f.getRecordingStartedAt(true)).sort()[0];
  }
}
