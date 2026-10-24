/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { editDocumentPreset } from './edit-document-preset';
import { PRESET_TEXT } from './preset-list.constants';

const renameDocumentPreset = (id: string, name: string): string | null =>
  editDocumentPreset(PRESET_TEXT.renameLabel, { name: COMMAND_NAME.presetRename, targets: null, options: { preset: id, name } });

export { renameDocumentPreset };
