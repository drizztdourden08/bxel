/* @layer renderer-app @kind constants */
import { DEFAULT_SCOPE_SETTINGS, DEFAULT_TRUST_STORE } from '@bxel/mcp';
import type { AssistantSettings } from './assistant.type';

const ASSISTANT_DEFAULTS: AssistantSettings = {
  assistantAccess: false,
  assistantStart: true,
  assistantLevel: DEFAULT_TRUST_STORE.level,
  assistantAllowAllMode: DEFAULT_TRUST_STORE.allowAllMode,
  assistantPrograms: DEFAULT_TRUST_STORE.programs,
  assistantSee: DEFAULT_SCOPE_SETTINGS.see,
  assistantWrite: DEFAULT_SCOPE_SETTINGS.write,
};

const ACTIVITY_MAX = 500;

const ASSISTANT_FOLDER_LABEL = 'Documents\\Bxel Assistant';

const EXPORT_FORMATS: readonly string[] = ['png'];

const ASSISTANT_TEXT = {
  pairTitle: 'A program wants to use Bxel',
  pairMessage: (name: string) =>
    `${name} wants to use Bxel. It can reach what your assistant settings allow: open documents, recent files and projects you granted. Programs report their own name, and Bxel cannot check it.`,
  pairAllow: 'Allow',
  pairDeny: 'Deny',
  readOnly: 'Allow read only',
  readOnlyHint: 'It can look at documents, read pixels and preview edits.',
  editing: 'Allow editing',
  editingHint: 'It can also change, save and export your files. Each batch is one undo step.',
  disabled: 'Assistant access is off in Settings.',
  denied: 'The owner denied the connection.',
  unnamed: 'Unnamed program',
  failed: (message: string) => `The tool failed in Bxel: ${message}`,
} as const;

export { ACTIVITY_MAX, ASSISTANT_DEFAULTS, ASSISTANT_FOLDER_LABEL, ASSISTANT_TEXT, EXPORT_FORMATS };
