/* @layer renderer-app @kind logic */
import type { CreationMemory } from '../new-sprite/new-sprite.type';
import type { ImportForm } from './image-import.type';

const importMemory = (form: ImportForm, previous: CreationMemory): CreationMemory => ({
  ...previous,
  limit: form.limit,
  transparent: form.transparent,
  presetId: form.source.kind === 'preset' ? form.source.presetId : previous.presetId,
});

export { importMemory };
