/* @layer renderer-app @kind logic */
import type { PathSession } from './editor.type';

type PathDraft = { current: PathSession | null };

const pathDraft: PathDraft = { current: null };

export { pathDraft };
