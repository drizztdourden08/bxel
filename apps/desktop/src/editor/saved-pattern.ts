/* @layer renderer-app @kind logic */
import type { SavedPattern } from '@bxel/document';
import { savedPatterns } from './saved-patterns';

const savedPattern = (id: string | null): SavedPattern | null => (id === null ? null : (savedPatterns().find((pattern) => pattern.id === id) ?? null));

export { savedPattern };
