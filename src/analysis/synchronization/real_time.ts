import SynchronizationMethod from './method';
import SavedFlight from '../../saved_flight';
import { minutes } from '../../units/duration';

export default class RealTime implements SynchronizationMethod {
  synchronize(flights: SavedFlight[]) {
    flights.forEach(f => f.setTimeOffset(minutes(0)));
  }
}
