/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import type { DocumentId } from '@bxel/document';
import type { OpenProject } from '../../project/project.type';
import type { ToolContext } from '../assistant.type';
import { importOne } from './import-one';
import { locateInProject } from './locate-in-project';
import { moveCreated } from './move-created';
import type { Entry, ImportReport } from './project-files-input.type';
import { TOOL_TEXT } from './tools.constants';

const importSources = async (
  context: ToolContext,
  scope: { readonly visible: OpenProject; readonly documentId: DocumentId; readonly defaults: AssetDefaults; readonly into: string | null },
  entries: readonly Entry[],
): Promise<ImportReport> => {
  const imported: ImportReport['imported'][number][] = [];
  const skipped: ImportReport['skipped'][number][] = [];
  for (const entry of entries) {
    const source = locateInProject(scope.visible, entry.path);
    const made = await importOne(context, scope.documentId, scope.defaults, entry).catch((error: unknown) => String(error));
    if (typeof made === 'string' || source === null) skipped.push({ path: source?.path ?? entry.path, reason: typeof made === 'string' ? made : TOOL_TEXT.noFolder });
    else imported.push({ source, created: await moveCreated(context, scope.visible, made, scope.into) });
  }
  return { imported, skipped };
};

export { importSources };
