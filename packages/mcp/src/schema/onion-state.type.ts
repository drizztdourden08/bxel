/* @layer core @kind types */
import type { z } from 'zod';
import type { TIMELINE_STATE_SCHEMA } from './timeline-view.constants';

type OnionState = z.infer<typeof TIMELINE_STATE_SCHEMA>['onion'];

export type { OnionState };
