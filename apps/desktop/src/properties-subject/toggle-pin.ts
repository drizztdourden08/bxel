/* @layer renderer-app @kind logic */
import { pinSubject } from './pin-subject';
import type { Subject } from './properties-subject.type';
import { useSubjectStore } from './useSubjectStore';

const togglePin = (subject: Subject): void => {
  if (subject.pinned) useSubjectStore.getState().unpin();
  else pinSubject(subject);
};

export { togglePin };
