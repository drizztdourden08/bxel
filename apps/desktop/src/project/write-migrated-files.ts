/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import { encodePalette } from '@bxel/document/native';
import type { Clock } from '@bxel/document/native';
import type { MigrationPlan, ResolvedFolder } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { baseName } from '../files/base-name';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { uniquePath } from '../workspace/unique-path';
import { locationPath } from './location-path';

const takenIn = async (documents: DocumentsPort, dir: string): Promise<Set<string>> => {
  const listing = await documents.list(dir).catch(() => ({ entries: [] }));
  return new Set(listing.entries.map((entry) => toSlashes(entry.path).toLowerCase()));
};

const freePath = async (documents: DocumentsPort, planned: string, taken: Map<string, Set<string>>): Promise<string> => {
  const dir = parentOf(planned);
  const names = taken.get(dir) ?? (await takenIn(documents, dir));
  taken.set(dir, names);
  const path = uniquePath(dir, baseName(planned), ASSET_FORMAT.palette.extension, names);
  names.add(path.toLowerCase());
  return path;
};

const writeMigratedFiles = async (
  documents: DocumentsPort,
  plan: MigrationPlan,
  folders: readonly ResolvedFolder[],
  clock: Clock,
): Promise<boolean> => {
  for (const location of plan.createFolders) {
    const path = locationPath(folders, location);
    if (path !== null) await documents.mkdir(path, { recursive: true });
  }
  const taken = new Map<string, Set<string>>();
  const written: boolean[] = [];
  for (const palette of plan.palettes) {
    const planned = locationPath(folders, palette.location);
    const path = planned === null ? null : await freePath(documents, toSlashes(planned), taken);
    const bytes = encodePalette(palette.slice, null, clock);
    written.push(path !== null && (await documents.write(path, bytes, { recent: false }).then(() => true, () => false)));
  }
  return written.every(Boolean);
};

export { writeMigratedFiles };
