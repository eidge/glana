import SavedFlight from 'saved_flight';
import SynchronizationMethod from './synchronization/method';
import RealTime from './synchronization/real_time';
import RecordingStarted from './synchronization/recording_started';

export let synchronizationMethods = {
  realTime: new RealTime(),
  recordingStarted: new RecordingStarted(),
};

export default class FlightGroup {
  readonly flights: SavedFlight[];
  synchronizationMethod!: SynchronizationMethod;

  constructor(flights: SavedFlight[]) {
    this.flights = flights;
    this.synchronize(synchronizationMethods.realTime);
  }

  synchronize(method: SynchronizationMethod) {
    if (this.synchronizationMethod === method) return;

    this.synchronizationMethod = method;
    this.synchronizationMethod.synchronize(this.flights);
  }
}
