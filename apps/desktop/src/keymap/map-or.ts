/* @layer renderer-app @kind logic */
import { inMapPlace } from '../tilemap/in-map-place';

const mapOr = (placing: () => unknown, otherwise: () => unknown) => (): void => {
  if (inMapPlace()) placing();
  else otherwise();
};

export { mapOr };
