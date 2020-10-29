import Position from '../../../position';
import { TaskTurnpoint } from '../../task';

export default interface Factory {
  start(name: string, center: Position): TaskTurnpoint;
  turnpoint(name: string, center: Position): TaskTurnpoint;
  finish(name: string, center: Position): TaskTurnpoint;
}
