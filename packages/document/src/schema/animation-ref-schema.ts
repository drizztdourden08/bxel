/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { AnimationId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const animationRefSchema = entityRefSchema<AnimationId>(ID_PREFIX.animation);

export { animationRefSchema };
