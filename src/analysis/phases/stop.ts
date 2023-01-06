import { PhaseType } from '.';
import Phase from './phase';

export default class Stop extends Phase {
  type: PhaseType = 'stopped';
}
