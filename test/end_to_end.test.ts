import Parser from '../src/igc/parser';
import fs from 'fs';
import Computer from '../src/flight_computer/computer';
import GPSSpeed from '../src/flight_computer/calculators/gps_speed';
import { Kilometer } from '../src/units/length';
import { Hour } from '../src/units/time';
import { Speed } from '../src/units/speed';
import Fix from '../src/flight_computer/fix';

describe('end to end', () => {
  it('works', () => {
    const calculators = new Map([['gpsSpeed', new GPSSpeed()]]);
    const computer = new Computer(calculators);

    const igc = fs.readFileSync(`${__dirname}/fixtures/9bsx8lc1.igc`, 'utf8');
    const parser = new Parser();
    const track = parser.parse(igc);
    const brecords = track.fixes.slice(500, 510);
    brecords.forEach(brecord => {
      if (!brecord.gpsAltitude) {
        return;
      }

      const fix = new Fix(
        new Date(brecord.timestamp),
        brecord.latitude,
        brecord.longitude,
        brecord.gpsAltitude,
        brecord.pressureAltitude
      );

      computer.update(fix);

      const speed = computer.calculators.get('gpsSpeed')?.getValue();

      if (!speed || !(speed instanceof Speed)) {
        return;
      }

      speed.setDx(Kilometer.from(speed.getDx()));
      speed.setDt(Hour.from(speed.getDt()));
      console.log(speed.toString());
    });
  });
});
