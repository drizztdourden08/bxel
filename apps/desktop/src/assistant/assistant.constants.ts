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
  assistantFolder: '',
  assistantProjects: [],
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
  fullControl: 'Full control',
  fullControlHint: 'It can also change the layout and settings, except the assistant settings. It cannot restart Bxel.',
  disabled: 'Assistant access is off in Settings.',
  denied: 'The owner denied the connection.',
  unnamed: 'Unnamed program',
  starting: 'Bxel is still starting. Try again in a moment.',
  failed: (message: string) => `The tool failed in Bxel: ${message}`,
} as const;

const CHIP_TEXT = {
  waiting: 'A program wants to connect',
  one: (name: string, editing: boolean) => `Assistant: ${name}, ${editing ? 'editing' : 'read only'}`,
  many: (count: number) => `Assistant: ${count} programs`,
  makeReadOnly: (name: string) => `Make ${name} read only`,
  allowEditing: (name: string) => `Allow ${name} to edit`,
  disconnect: (name: string) => `Disconnect ${name}`,
  settings: 'Assistant programs',
} as const;

export { ACTIVITY_MAX, ASSISTANT_DEFAULTS, ASSISTANT_FOLDER_LABEL, ASSISTANT_TEXT, CHIP_TEXT, EXPORT_FORMATS };
