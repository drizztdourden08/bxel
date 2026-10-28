/* @layer renderer-app @kind logic */
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';
import type { Subject } from './properties-subject.type';

const openSubject = (subject: Subject): void => focusTab(tabOf(subject.focus.documentId, subject.focus.key));

export { openSubject };
