import Parser from '../src/igc/parser';
import fs from 'fs';
import Computer from '../src/flight_computer/computer';
import Calculator from '../src/flight_computer/calculators/calculator';
import GPSSpeed from '../src/flight_computer/calculators/gps_speed';
import Vario from '../src/flight_computer/calculators/vario';
import Heading from '../src/flight_computer/calculators/heading';
import { kilometersPerHour, metersPerSecond } from '../src/units/speed';
import Fix from '../src/flight_computer/fix';
import { QuantityFactory } from '../src/units/quantity_factory';

function printCalculator(
  calculator: Calculator | undefined,
  quantityFactory: QuantityFactory | null = null
) {
  let value = calculator?.getValue();

  if (!value) {
    return;
  }
  if (quantityFactory) {
    value = value.convertTo(quantityFactory);
  }
  console.log(calculator?.name(), value.toString());
}

describe('end to end', () => {
  it('works', () => {
    const calculators = new Map<string, Calculator>([
      ['gpsSpeed', new GPSSpeed()],
      ['vario', new Vario()],
      ['heading', new Heading()],
    ]);
    const computer = new Computer(calculators);

    const igc = fs.readFileSync(`${__dirname}/fixtures/9bsx8lc1.igc`, 'utf8');
    const parser = new Parser();
    const track = parser.parse(igc);
    const brecords = track.fixes.slice(5490, 5510);
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

      console.log(fix.updatedAt);
      printCalculator(computer.calculators.get('gpsSpeed'), kilometersPerHour);
      printCalculator(computer.calculators.get('vario'), metersPerSecond);
      printCalculator(computer.calculators.get('heading'));
    });
  });
});
