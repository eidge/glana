import SavedFlight from 'saved_flight';

type SynchronizationType = 'realTime' | 'takeoffTime';

export default class FlightGroup {
  currentTimestamp: Date;
  followFlight: SavedFlight;
  flights: SavedFlight[];
  synchronizationType: SynchronizationType;

  constructor(flights: SavedFlight[]) {
    this.synchronizationType = 'realTime';
    this.flights = flights;
    this.followFlight = flights[0];
    this.currentTimestamp = this.followFlight.datums[0].timestamp;
  }

  synchronize(type: SynchronizationType) {
    this.synchronizationType = type;
    // Do some synchro here!
  }
}
