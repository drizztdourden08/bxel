/* @layer renderer-app @kind logic */
import type { FileKit } from '../files/files.type';
import { writeManifest } from '../project/write-manifest';
import { useProjectStore } from '../stores/useProjectStore';
import { applyOrganiseOp } from './apply-organise-op';
import { ORGANISE_TEXT } from './organise.constants';
import type { OrganiseOp, OrganiseOutcome } from './organise.type';
import { organiseOf } from './organise-of';

let queue: Promise<unknown> = Promise.resolve();

const run = async (kit: Pick<FileKit, 'documents' | 'clock'>, op: OrganiseOp): Promise<OrganiseOutcome> => {
  const { project } = useProjectStore.getState();
  if (!project) return { ok: false, message: ORGANISE_TEXT.noProject };
  const before = organiseOf(project.manifest);
  const change = applyOrganiseOp(before, op);
  if (!change.ok) return change;
  if (JSON.stringify(change.organise) === JSON.stringify(before)) return { ok: true, note: change.note };
  const saved = await writeManifest(kit, { ...project.manifest, organise: change.organise });
  return saved.ok ? { ok: true, note: change.note } : { ok: false, message: ORGANISE_TEXT.saveFailed(saved.message) };
};

const editOrganiseWith = (kit: Pick<FileKit, 'documents' | 'clock'>, op: OrganiseOp): Promise<OrganiseOutcome> => {
  const next = queue.then(() => run(kit, op));
  queue = next.catch(() => undefined);
  return next;
};

export { editOrganiseWith };
