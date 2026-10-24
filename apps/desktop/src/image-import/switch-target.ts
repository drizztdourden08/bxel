/* @layer renderer-app @kind logic */
import { baseName } from '../files/base-name';
import { DEFAULT_SPRITE_NAME } from '../sprite-name/sprite-name.constants';
import { uniqueName } from '../sprite-name/unique-name';
import { defaultReduce } from './default-reduce';
import type { ImportContext, ImportForm, ImportTarget, SourceImage } from './image-import.type';

const switchTarget = (form: ImportForm, target: ImportTarget, image: SourceImage, context: ImportContext): ImportForm => {
  const taken = target === 'file' ? context.taken : [];
  const base = baseName(image.fileName).trim() || DEFAULT_SPRITE_NAME;
  const next = { ...form, target, name: uniqueName(base, taken) };
  return { ...next, reduce: defaultReduce(next, image, context) };
};

export { switchTarget };
