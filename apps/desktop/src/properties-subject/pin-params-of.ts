/* @layer renderer-app @kind logic */
import type { NavigationState, ScreenParams } from '@drizztdourden08/brock-react';
import { PROPERTIES_HUB } from '../config-entry/config-entry.constants';

const NONE: ScreenParams = {};

type NavSlice = Pick<NavigationState, 'active' | 'params' | 'remembered'>;

const pinParamsOf = (state: NavSlice): ScreenParams => (state.active === PROPERTIES_HUB ? state.params : state.remembered[PROPERTIES_HUB] ?? NONE);

export { pinParamsOf };
