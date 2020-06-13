import Unit from './unit';
import Quantity from './quantity';

type QuantityFactory = {
  (value: number): Quantity<Unit>;
  unit: Unit;
};

function makeQuantityFactory(unit: Unit): QuantityFactory {
  const factory = (value: number) => {
    return new Quantity(value, unit);
  };

  factory.unit = unit;

  return factory;
}

export { QuantityFactory, makeQuantityFactory };
