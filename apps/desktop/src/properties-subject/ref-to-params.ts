/* @layer renderer-app @kind logic */
import type { ScreenParams } from '@drizztdourden08/brock-react';
import { encodeSubject } from './encode-subject';
import { PIN_ON, SUBJECT_PARAM } from './properties-subject.constants';
import type { SubjectRef } from './properties-subject.type';

const refToParams = (ref: SubjectRef | null): ScreenParams => {
  const subject = ref === null ? undefined : encodeSubject(ref);
  if (subject === undefined) return { [SUBJECT_PARAM.subject]: undefined, [SUBJECT_PARAM.pin]: undefined };
  return { [SUBJECT_PARAM.subject]: subject, [SUBJECT_PARAM.pin]: PIN_ON };
};

export { refToParams };
