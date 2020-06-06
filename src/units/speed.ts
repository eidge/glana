import Unit from './unit';
import { Time } from './time';
import { Length } from './length';

class Speed extends Unit {
  unit!: string;
  value!: number;

  private dx: Length;
  private dt: Time;

  constructor(dx: Length, dt: Time) {
    super();

    this.dx = dx;
    this.dt = dt;
    this.setUnitAndValue();
  }

  private setUnitAndValue() {
    this.unit = `${this.dx.unit}/${this.dt.unit}`;
    this.value = this.dx.value / this.dt.value;
  }

  getDx() {
    return this.dx;
  }

  setDx(dx: Length) {
    this.dx = dx;
    this.setUnitAndValue();
  }

  getDt() {
    return this.dt;
  }

  setDt(dt: Time) {
    this.dt = dt;
    this.setUnitAndValue();
  }
}

export { Speed };
