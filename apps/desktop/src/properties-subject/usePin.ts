/* @layer renderer-app @kind hook */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { pinParamsOf } from './pin-params-of';
import { PIN_ON, SUBJECT_PARAM } from './properties-subject.constants';
import type { SubjectRef } from './properties-subject.type';
import { paramsToRef } from './subject-params';

const usePin = (): SubjectRef | null => {
  const subject = useNavigationStore((state) => {
    const params = pinParamsOf(state);
    const value = params[SUBJECT_PARAM.subject];
    return params[SUBJECT_PARAM.pin] === PIN_ON && typeof value === 'string' ? value : '';
  });
  return useMemo(() => paramsToRef({ [SUBJECT_PARAM.subject]: subject, [SUBJECT_PARAM.pin]: PIN_ON }), [subject]);
};

export { usePin };
