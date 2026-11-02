/* @layer renderer-app @kind logic */
import { KEY_PREFIX } from './properties-subject.constants';
import type { SubjectRef } from './properties-subject.type';

const encodeSubject = (ref: SubjectRef): string | undefined => {
  if (ref.path !== null) return ref.path;
  return ref.key === null ? undefined : `${KEY_PREFIX}${ref.key.kind}:${ref.key.id}`;
};

export { encodeSubject };
