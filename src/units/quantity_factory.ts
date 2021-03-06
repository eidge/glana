import Unit from './unit';
import Quantity from './quantity';

export type QuantityFactory<U extends Unit> = {
  (value: number): Quantity<U>;
  unit: U;
};

export function makeQuantityFactory<U extends Unit>(
  unit: U
): QuantityFactory<U> {
  const factory = (value: number): Quantity<U> => {
    return new Quantity(value, unit);
  };

  factory.unit = unit;

  return factory;
}
