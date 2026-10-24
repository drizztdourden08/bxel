/* @layer core @kind logic */
import { canSee } from './can-see';
import type { SeeScope, SeeTarget } from './scope.type';

const filterVisible = <T>(places: readonly T[], scope: SeeScope, targetOf: (place: T) => SeeTarget): T[] =>
  places.filter((place) => canSee(scope, targetOf(place)));

export { filterVisible };
