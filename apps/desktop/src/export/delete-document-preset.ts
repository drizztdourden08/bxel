/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { editDocumentPreset } from './edit-document-preset';
import { PRESET_TEXT } from './preset-list.constants';

const deleteDocumentPreset = (id: string): string | null =>
  editDocumentPreset(PRESET_TEXT.deleteLabel, { name: COMMAND_NAME.presetDelete, targets: null, options: { preset: id } });

export { deleteDocumentPreset };
