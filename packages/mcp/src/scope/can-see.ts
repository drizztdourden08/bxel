/* @layer core @kind logic */
import { SEE_ALLOWS } from './scope.constants';
import type { SeeScope, SeeTarget } from './scope.type';

const canSee = (scope: SeeScope, target: SeeTarget): boolean => SEE_ALLOWS[scope].includes(target);

export { canSee };
