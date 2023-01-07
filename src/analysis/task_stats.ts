import { hours, milliseconds } from '../units/duration';
import { kilometersPerHour, knots } from '../units/speed';
import Task, { TaskTurnpoint } from '../flight_computer/tasks/task';
import Glide from './phases/glide';
import Phase from './phases/phase';
import Thermal from './phases/thermal';
import Turnpoint from './phases/turnpoint';
import { kilometers, meters } from '../units/length';
import { dimensionless } from '../units/dimensionless';

class PartialStats {
  private task: Task;
  private phases: Phase[];
  private glides: Glide[];
  private thermals: Thermal[];
  private endTPIdx: number;
  private startTPIdx: number;
  private startTP: TaskTurnpoint;
  private endTP: TaskTurnpoint;

  constructor(
    task: Task,
    startTPIdx: number,
    endTPIdx: number,
    phases: Phase[]
  ) {
    this.task = task;
    this.startTPIdx = startTPIdx;
    this.endTPIdx = endTPIdx;
    this.startTP = this.task.turnpoints[startTPIdx];
    this.endTP = this.task.turnpoints[endTPIdx];
    this.phases = this.filterPhases(phases, startTPIdx, endTPIdx);
    this.glides = this.phases.filter(ph => ph.type === 'gliding') as Glide[];
    this.thermals = this.phases.filter(
      ph => ph.type === 'thermalling'
    ) as Thermal[];
  }

  private filterPhases(phases: Phase[], startTPIdx: number, endTPIdx: number) {
    const startPhaseIdx =
      phases.findIndex(
        phase =>
          phase instanceof Turnpoint && phase.turnpointIndex === startTPIdx
      ) + 1;

    const endPhaseIdx = phases.findIndex(
      phase => phase instanceof Turnpoint && phase.turnpointIndex === endTPIdx
    );

    if (startPhaseIdx === -1 || endPhaseIdx === -1)
      throw new Error('Invalid stats calculation');

    return phases.slice(startPhaseIdx, endPhaseIdx);
  }

  get duration() {
    const startedAt = this.task.getTurnpointReachedAt(this.startTP);
    const finishedAt = this.task.getTurnpointReachedAt(this.endTP);

    if (!startedAt || !finishedAt) return milliseconds(0);

    return milliseconds(finishedAt.getTime() - startedAt.getTime());
  }

  get distance() {
    const startedAt = this.task.getTurnpointReachedAt(this.startTP);
    const finishedAt = this.task.getTurnpointReachedAt(this.endTP);

    if (!startedAt || !finishedAt) return meters(0);

    let total = meters(0);

    for (let i = this.startTPIdx; i < this.endTPIdx; ++i) {
      const leftTP = this.task.turnpoints[i];
      const rightTP = this.task.turnpoints[i + 1];
      total = total.add(leftTP.center.distance2DTo(rightTP.center));
    }

    return total;
  }

  get speed() {
    return kilometersPerHour(
      this.distance.convertTo(kilometers).value /
        this.duration.convertTo(hours).value
    );
  }

  get numberOfThermals() {
    return this.thermals.length;
  }

  get averageClimbRate() {
    const totalDuration = this.thermals
      .reduce((total, thermal) => total.add(thermal.duration), milliseconds(0))
      .convertTo(milliseconds).value;

    return this.thermals.reduce(
      (total, thermal) =>
        total.add(
          thermal.climbRate.multiply(
            thermal.duration.convertTo(milliseconds).value / totalDuration
          )
        ),
      knots(0)
    );
  }

  get totalClimb() {
    return this.thermals.reduce(
      (total, thermal) => total.add(thermal.altitudeGain),
      meters(0)
    );
  }

  get numberOfGlides() {
    return this.glides.length;
  }

  get totalGlideDistance() {
    return this.glides.reduce(
      (total, glide) => total.add(glide.distance),
      meters(0)
    );
  }

  get averageGlideAngle() {
    const totalLength = this.totalGlideDistance.convertTo(meters).value;

    return this.glides.reduce(
      (avg, glide) =>
        avg.add(
          glide.glideAngle.multiply(
            glide.distance.convertTo(meters).value / totalLength
          )
        ),
      dimensionless(0)
    );
  }

  get averageGlideSpeed() {
    const totalLength = this.totalGlideDistance.convertTo(meters).value;

    return this.glides.reduce(
      (avg, glide) =>
        avg.add(
          glide.speed.multiply(
            glide.distance.convertTo(meters).value / totalLength
          )
        ),
      kilometersPerHour(0)
    );
  }
}

export default class TaskStats {
  private task: Task;
  private phases: Phase[];
  private taskStats?: PartialStats | null;
  private legStats: WeakMap<TaskTurnpoint, PartialStats | null> = new WeakMap();

  constructor(task: Task, phases: Phase[]) {
    this.task = task;
    this.phases = phases;
  }

  stats(): PartialStats | null {
    if (!this.task.isFinished()) return null;
    if (this.taskStats) return this.taskStats || null;

    this.taskStats = new PartialStats(
      this.task,
      0,
      this.task.turnpoints.length - 1,
      this.phases
    );

    return this.taskStats;
  }

  statsFor(tp: TaskTurnpoint): PartialStats | null {
    const cachedStats = this.legStats.get(tp);
    if (cachedStats) return cachedStats;

    const stats = this.buildStatsFor(tp);
    this.legStats.set(tp, stats);

    return stats;
  }

  private buildStatsFor(tp: TaskTurnpoint): PartialStats | null {
    const tpIdx = this.task.turnpoints.indexOf(tp);

    if (tpIdx === -1) throw new Error('Turnpoint not found in task');
    if (
      tpIdx === this.task.turnpoints.length - 1 ||
      !this.task.getTurnpointReachedAt(this.task.turnpoints[tpIdx + 1])
    ) {
      return null;
    }

    return new PartialStats(this.task, tpIdx, tpIdx + 1, this.phases);
  }
}
