import { GliderState } from '../../flight_computer/state_machine';
import SavedFlight from '../../saved_flight';
import Thermal from './thermal';
import Glide from './glide';
import Stop from './stop';

export function build(
  type: GliderState,
  flight: SavedFlight,
  startIdx: number,
  endIdx: number
) {
  switch (type) {
    case 'thermalling':
      return new Thermal(flight, startIdx, endIdx);
    case 'gliding':
      return new Glide(flight, startIdx, endIdx);
    case 'stopped':
      return new Stop(flight, startIdx, endIdx);
  }
}
