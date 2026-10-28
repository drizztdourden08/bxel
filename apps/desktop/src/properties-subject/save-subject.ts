/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { reportOutcome } from '../files/report-outcome';
import { saveTab } from '../workspace/save-tab';
import { tabOf } from '../workspace/tab-of';
import { SUBJECT_TEXT } from './properties-subject.constants';
import type { Subject } from './properties-subject.type';

const saveSubject = async (subject: Subject): Promise<void> => {
  const kit = fileKit();
  if (!kit) return;
  const outcome = await saveTab(kit, tabOf(subject.focus.documentId, subject.focus.key), false);
  reportOutcome(outcome, { kind: 'save' });
  if (outcome.kind === 'done') toast(SUBJECT_TEXT.saved(subject.fileName), { variant: 'success' });
};

export { saveSubject };
