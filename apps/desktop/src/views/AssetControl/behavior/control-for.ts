/* @layer renderer-app @kind logic */
import type { ComponentType } from 'react';
import { CONTROLS } from './control-for.constants';

const controlFor = (field: string): ComponentType | undefined => (Object.hasOwn(CONTROLS, field) ? CONTROLS[field] : undefined);

export { controlFor };
