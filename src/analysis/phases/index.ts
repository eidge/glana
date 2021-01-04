import { GliderState } from '../../flight_computer/state_machine';
import SavedFlight from '../../saved_flight';
import Thermal from './thermal';
import Glide from './glide';
import Stop from './stop';

export function build(
  type: GliderState,
  flight: SavedFlight,
  startIndex: number,
  endIndex: number
) {
  switch (type) {
    case 'thermalling':
      return new Thermal(flight, startIndex, endIndex);
    case 'gliding':
      return new Glide(flight, startIndex, endIndex);
    case 'stopped':
      return new Stop(flight, startIndex, endIndex);
  }
}
