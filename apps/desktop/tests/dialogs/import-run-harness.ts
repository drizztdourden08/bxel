/* @layer renderer-app @kind test */
import { activeRects } from '../../src/image-import/active-rects';
import { colorsView } from '../../src/image-import/colors-view';
import { importNames } from '../../src/image-import/import-names';
import type { ImportContext, ImportForm, ImportRun, SourceImage } from '../../src/image-import/image-import.type';
import { initialImportForm } from '../../src/image-import/initial-import-form';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';

const NONE: ImportContext = { documentId: null, bank: null, taken: [], animationNames: [], sheetNames: [], tilesetNames: [], tilemapNames: [], spriteCount: 0 };

const formFor = (image: SourceImage, context: ImportContext, patch: Partial<ImportForm>): ImportForm => ({
  ...initialImportForm(image, context, NEW_MEMORY_DEFAULT),
  ...patch,
});

const runOf = (form: ImportForm, image: SourceImage, context: ImportContext): ImportRun => {
  const plan = colorsView(form, image, context).plan;
  if (!plan) throw new Error('no plan');
  const rects = activeRects(form, image);
  return { form, image, plan, rects, names: importNames(form, rects), context, tiled: null };
};

export { formFor, NONE, runOf };
