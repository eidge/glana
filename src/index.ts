import FlightComputer from './flight_computer/computer';
import Quantity from 'units/quantity';
import Unit from 'units/unit';
import SavedFlight from './saved_flight';

export function analyseIGCTrack(computer: FlightComputer, flight: SavedFlight) {
  const result: any[] = [];

  flight.fixes.forEach(fix => {
    computer.update(fix);

    let datum: { [name: string]: Quantity<Unit> | Date | null } = {
      timestamp: fix.updatedAt,
    };

    computer.calculators.forEach((calculator, name) => {
      datum[name] = calculator.getValue();
    });

    result.push(datum);
  });

  return result;
}
