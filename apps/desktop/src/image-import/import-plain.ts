/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import type { DocumentId } from '@bxel/document';
import { memoryOf } from '../asset-defaults/memory-of';
import type { DocumentHost } from '../documents/document-host.type';
import { activeRects } from './active-rects';
import { colorsView } from './colors-view';
import { IMPORT_TEXT } from './image-import.constants';
import type { ImportErrors, ImportOutcome, SourceImage } from './image-import.type';
import { importContext } from './import-context';
import { importErrors } from './import-errors';
import { importKindOf } from './import-kind-of';
import { importNames } from './import-names';
import { initialImportForm } from './initial-import-form';
import { runImport } from './run-import';

const firstProblem = (problems: ImportErrors): string | null =>
  [problems.name, problems.size, problems.limit, problems.palette, problems.slice, problems.naming].find((each) => each !== null) ?? null;

const importPlain = (host: DocumentHost, documentId: DocumentId, image: SourceImage, defaults: AssetDefaults): ImportOutcome => {
  const context = importContext(host.view(documentId));
  const form = initialImportForm(image, context, memoryOf(defaults), importKindOf(image, null));
  const colors = colorsView(form, image, context);
  const rects = activeRects(form, image);
  const names = importNames(form, rects);
  const problem = firstProblem(importErrors({ form, image, context, rects, names }));
  if (problem !== null) return { ok: false, message: problem };
  if (!colors.plan) return { ok: false, message: IMPORT_TEXT.unreadable };
  return runImport(host, { form, image, plan: colors.plan, rects, names, context, tiled: null });
};

export { importPlain };
