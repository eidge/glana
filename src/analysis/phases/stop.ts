import Phase from './phase';
import { GliderState } from '../../flight_computer/state_machine';

export default class Stop extends Phase {
  type: GliderState = 'stopped';
}
