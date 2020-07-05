import Parser from '../src/igc/parser';
import fs from 'fs';
import Computer, { Datum } from '../src/flight_computer/computer';

describe('end to end', () => {
  it('works', () => {
    const computer = new Computer();

    const igc = fs.readFileSync(`${__dirname}/fixtures/9bsx8lc1.igc`, 'utf8');
    const parser = new Parser();
    const flight = parser.parse(igc);
    const fixes = flight.fixes.slice(5490, 5510);
    const data: Datum[] = [];
    fixes.forEach(fix => {
      computer.update(fix);
      data.push(computer.currentDatum!);
    });
    expect(data).toMatchSnapshot();
  });
});
