/* @layer renderer-app @kind logic */
import { STEPS_BY_KIND } from './image-import.constants';
import type { ImportKind, ImportStep } from './image-import.type';

const stepsOf = (kind: ImportKind): readonly ImportStep[] => STEPS_BY_KIND[kind];

export { stepsOf };
