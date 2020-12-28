import SavedFlight from '../saved_flight';
import SynchronizationMethod from './synchronization/method';
import RealTime from './synchronization/real_time';
import RecordingStarted from './synchronization/recording_started';
import TakeOff from './synchronization/take_off';
import TaskStarted from './synchronization/task_started';

export let synchronizationMethods = {
  realTime: new RealTime(),
  recordingStarted: new RecordingStarted(),
  takeOff: new TakeOff(),
  taskStarted: new TaskStarted(),
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

  get earliestDatumAt() {
    return this.flights.map(f => f.getRecordingStartedAt()).sort()[0];
  }

  get latestDatumAt() {
    return this.flights.map(f => f.getRecordingStoppedAt()).sort()[
      this.flights.length - 1
    ];
  }
}
