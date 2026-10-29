/* @layer core @kind logic */
import { inkSchema } from './ink-schema';
import { strokeFields } from './stroke-fields';

const inkedStrokeFields = { ...strokeFields, ink: inkSchema };

export { inkedStrokeFields };
