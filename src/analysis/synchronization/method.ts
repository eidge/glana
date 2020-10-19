import SavedFlight from '../../saved_flight';

export default interface SynchronizationMethod {
  synchronize(flights: SavedFlight[]): void;
}
