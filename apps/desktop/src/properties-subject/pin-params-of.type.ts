/* @layer renderer-app @kind types */
import type { NavigationState } from '@drizztdourden08/brock-react';

type NavSlice = Pick<NavigationState, 'active' | 'params' | 'remembered'>;

export type { NavSlice };
