/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { reportOutcome } from '../files/report-outcome';
import { focusTab } from '../workspace/focus-tab';
import { saveTab } from '../workspace/save-tab';
import { tabOf } from '../workspace/tab-of';
import { SUBJECT_TEXT } from './properties-subject.constants';
import type { Subject } from './properties-subject.type';
import { useSubjectStore } from './useSubjectStore';

const pinSubject = (subject: Subject): void => useSubjectStore.getState().pinTo({ path: subject.path, key: subject.focus.key });

const togglePin = (subject: Subject): void => {
  if (subject.pinned) useSubjectStore.getState().unpin();
  else pinSubject(subject);
};

const openSubject = (subject: Subject): void => focusTab(tabOf(subject.focus.documentId, subject.focus.key));

const saveSubject = async (subject: Subject): Promise<void> => {
  const kit = fileKit();
  if (!kit) return;
  const outcome = await saveTab(kit, tabOf(subject.focus.documentId, subject.focus.key), false);
  reportOutcome(outcome, { kind: 'save' });
  if (outcome.kind === 'done') toast(SUBJECT_TEXT.saved(subject.fileName), { variant: 'success' });
};

export { openSubject, pinSubject, saveSubject, togglePin };
