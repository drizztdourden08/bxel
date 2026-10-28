/* @layer renderer-app @kind logic */
import type { Subject } from './properties-subject.type';
import { useSubjectStore } from './useSubjectStore';

const pinSubject = (subject: Subject): void => useSubjectStore.getState().pinTo({ path: subject.path, key: subject.focus.key });

export { pinSubject };
