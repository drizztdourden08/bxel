/* @layer renderer-app @kind logic */
import { presetById } from '../platform-preset/preset-by-id';
import { DEFAULT_SPRITE_NAME } from '../sprite-name/sprite-name.constants';
import { uniqueName } from '../sprite-name/unique-name';
import { patchForm } from './patch-form';
import { NEW_FORM_BASE } from './new-sprite.constants';
import type { CreationForm, CreationMemory } from './new-sprite.type';
import { platformPatch } from './platform-patch';

const memoryForm = (memory: CreationMemory, taken: readonly string[]): CreationForm =>
  patchForm(
    {
      ...NEW_FORM_BASE,
      name: uniqueName(DEFAULT_SPRITE_NAME, taken),
      width: memory.width,
      height: memory.height,
      limit: memory.limit,
      frameMs: memory.frameMs ?? NEW_FORM_BASE.frameMs,
      pixelGrid: memory.pixelGrid ?? NEW_FORM_BASE.pixelGrid,
      transparent: memory.transparent,
      background: memory.transparent ? 'transparent' : 'opaque',
      source: { kind: 'preset', presetId: memory.presetId, file: null },
    },
    {},
  );

const initialForm = (memory: CreationMemory, taken: readonly string[]): CreationForm => {
  const form = memoryForm(memory, taken);
  const preset = presetById(memory.platformId);
  return preset ? patchForm(form, platformPatch(preset, form)) : form;
};

export { initialForm };
