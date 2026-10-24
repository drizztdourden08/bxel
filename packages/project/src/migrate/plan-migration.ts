/* @layer core @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { ProjectResult } from '../errors/project-result.type';
import { projectOk } from '../errors/project-ok';
import { DEFAULT_ROLE_PATHS, PROJECT_DOCUMENT_VERSION } from '../project-document/project-document.constants';
import type { ProjectDocument } from '../project-document/project-document.type';
import { parseProjectDocumentValue } from '../project-document/parse-project-document-value';
import { roleFolders } from '../project-document/role-folders';
import { manifestFileName } from '../manifest/manifest-file-name';
import type { ProjectManifest } from '../manifest/manifest.type';
import { migratedDefaults } from './migrated-defaults';
import { migratedFolders } from './migrated-folders';
import type { MigrationOptions, MigrationPlan } from './migration.type';
import { planPalettes } from './plan-palettes';

const planMigration = (manifest: ProjectManifest, options: MigrationOptions): ProjectResult<MigrationPlan> => {
  const folders = migratedFolders(manifest);
  const migrated = parseProjectDocumentValue({
    format: manifest.format,
    formatVersion: PROJECT_DOCUMENT_VERSION,
    projectId: manifest.projectId,
    name: manifest.name,
    folders,
    defaults: migratedDefaults(manifest.settings),
    assistant: { access: manifest.assistant.access },
  } satisfies ProjectDocument);
  if (!migrated.ok) return migrated;
  const primary = folders.find((folder) => folder.folderId === manifest.settings.newFiles.folderId);
  const palettes = planPalettes(
    manifest.swatchSets,
    manifest.settings.newFiles.folderId,
    primary?.roles.palettes ?? DEFAULT_ROLE_PATHS.palettes,
    options.ids,
  );
  return projectOk({
    manifest: migrated.value,
    projectFileName: `${manifest.name}${ASSET_FORMAT.project.extension}`,
    createFolders: roleFolders(folders),
    palettes,
    trash: options.sourceFileName ?? manifestFileName(manifest.name),
  });
};

export { planMigration };
