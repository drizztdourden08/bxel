/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { Relocation } from './file-ops.type';

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const within = (path: string, folder: string): boolean => same(path, folder) || path.toLowerCase().startsWith(`${folder.toLowerCase()}/`);

const planMoves = async (paths: readonly string[], toFolder: string): Promise<readonly Relocation[] | string> => {
  const kit = fileKit();
  if (!kit) return FILE_OPS_TEXT.unavailable;
  const target = toSlashes(toFolder).replace(/\/$/, '');
  if (paths.some((path) => within(target, toSlashes(path)))) return FILE_OPS_TEXT.intoItself;
  const listing = await kit.documents.list(target).catch(() => null);
  if (listing === null) return FILE_OPS_TEXT.unreachable(fileName(target));
  const taken = new Set(listing.entries.map((entry) => entry.name.toLowerCase()));
  const plan: Relocation[] = [];
  for (const path of paths.map(toSlashes)) {
    if (same(parentOf(path), target)) continue;
    const name = fileName(path);
    if (taken.has(name.toLowerCase())) return `${name} is already in that folder.`;
    taken.add(name.toLowerCase());
    plan.push({ from: path, to: `${target}/${name}` });
  }
  return plan.length === 0 ? FILE_OPS_TEXT.nothingToMove : plan;
};

export { planMoves };
