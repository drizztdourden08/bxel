/* @layer renderer-app @kind logic */
import { encodePalette } from '@bxel/document/native';
import type { Clock } from '@bxel/document/native';
import { isSamePath } from '@bxel/project';
import type { MigrationPlan, ResolvedFolder } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { locationPath } from './location-path';

const parentOf = (path: string): string => path.slice(0, path.lastIndexOf('/'));

const isTaken = async (documents: DocumentsPort, path: string): Promise<boolean> => {
  const listing = await documents.list(parentOf(path)).catch(() => ({ entries: [] }));
  return listing.entries.some((entry) => isSamePath(entry.path, path));
};

const writeMigratedFiles = async (
  documents: DocumentsPort,
  plan: MigrationPlan,
  folders: readonly ResolvedFolder[],
  clock: Clock,
): Promise<void> => {
  for (const location of plan.createFolders) {
    const path = locationPath(folders, location);
    if (path !== null) await documents.mkdir(path, { recursive: true });
  }
  for (const palette of plan.palettes) {
    const path = locationPath(folders, palette.location);
    if (path === null || (await isTaken(documents, path))) continue;
    await documents.write(path, encodePalette(palette.slice, null, clock), { recent: false });
  }
};

export { writeMigratedFiles };
