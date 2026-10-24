/* @layer renderer-app @kind logic */
import { baseName } from '../files/base-name';
import type { CreationMemory } from '../new-sprite/new-sprite.type';
import { DEFAULT_SPRITE_NAME } from '../sprite-name/sprite-name.constants';
import { FORM_BASE } from './image-import.constants';
import type { ImportContext, ImportForm, SourceImage } from './image-import.type';
import { switchTarget } from './switch-target';

const initialImportForm = (image: SourceImage, context: ImportContext, memory: CreationMemory): ImportForm => {
  const base = baseName(image.fileName).trim() || DEFAULT_SPRITE_NAME;
  const form: ImportForm = {
    ...FORM_BASE,
    limit: memory.limit,
    transparent: memory.transparent,
    source: { kind: 'preset', presetId: memory.presetId, file: null },
    slice: { ...FORM_BASE.slice, names: `${base}_{n}` },
  };
  return switchTarget(form, context.documentId === null ? 'new' : 'file', image, context);
};

export { initialImportForm };
