/* @layer renderer-app @kind logic */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { pinParamsOf } from './pin-params-of';
import type { SubjectRef } from './properties-subject.type';
import { paramsToRef } from './subject-params';

const readPin = (): SubjectRef | null => paramsToRef(pinParamsOf(useNavigationStore.getState()));

export { readPin };
