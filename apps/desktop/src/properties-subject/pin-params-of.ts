/* @layer renderer-app @kind logic */
import type { ScreenParams } from '@drizztdourden08/brock-react';
import { PROPERTIES_HUB } from '../config-entry/config-entry.constants';
import { NONE } from './pin-params-of.constants';
import type { NavSlice } from './pin-params-of.type';

const pinParamsOf = (state: NavSlice): ScreenParams => (state.active === PROPERTIES_HUB ? state.params : state.remembered[PROPERTIES_HUB] ?? NONE);

export { pinParamsOf };
