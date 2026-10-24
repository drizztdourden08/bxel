/* @layer renderer-app @kind logic */
import { fileSafeStem } from '@bxel/document';
import { encodeProject, unpackProject } from '@bxel/project';
import type { DecodedProject, UnpackPlan } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toast } from '@drizztdourden08/brock-react';
import { reasonOf } from '../files/reason-of';
import { parentOf } from '../workspace/parent-of';
import { PACK_TEXT, UNPACK_FALLBACK } from './pack.constants';
import type { UnpackOutcome } from './project.type';

const freeFolderName = async (documents: DocumentsPort, parent: string, wanted: string): Promise<string> => {
  const listing = await documents.list(parent).catch(() => ({ entries: [] }));
  const taken = new Set(listing.entries.map((entry) => entry.name.toLowerCase()));
  let name = wanted;
  for (let count = 2; taken.has(name.toLowerCase()); count += 1) name = `${wanted} ${count}`;
  return name;
};

const planFor = async (documents: DocumentsPort, packed: DecodedProject, parent: string): Promise<UnpackPlan> => {
  const name = await freeFolderName(documents, parent, fileSafeStem(packed.manifest.name, UNPACK_FALLBACK));
  const folders = packed.manifest.folders.map((folder, index) => (index === 0 ? { ...folder, name } : folder));
  const plan = unpackProject({ ...packed.manifest, folders }, [...packed.assets.keys()], parent);
  if (!plan.ok) throw new Error(plan.message);
  return plan.value;
};

const writePlan = async (documents: DocumentsPort, plan: UnpackPlan, packed: DecodedProject): Promise<void> => {
  await documents.mkdir(plan.root, { recursive: true });
  for (const operation of plan.operations) {
    if (operation.kind === 'mkdir') await documents.mkdir(operation.path, { recursive: true });
    else await documents.write(operation.path, packed.assets.get(operation.entry) ?? new Uint8Array(), { recent: false });
  }
  const bytes = encodeProject({ manifest: plan.manifest, preview: packed.preview, assets: new Map() }, () => Date.now());
  if (!bytes.ok) throw new Error(bytes.message);
  await documents.write(plan.projectFile, bytes.value, { recent: false });
};

const unpackPackedProject = async (documents: DocumentsPort, source: string, packed: DecodedProject): Promise<UnpackOutcome | null> => {
  const picked = await documents.openFolder({ title: PACK_TEXT.unpackTitle, defaultPath: parentOf(source) });
  if (picked === null) return null;
  try {
    const plan = await planFor(documents, packed, picked);
    await writePlan(documents, plan, packed);
    if (plan.skipped.length > 0) toast(PACK_TEXT.skipped(plan.skipped.length), { variant: 'warning' });
    return { ok: true, root: plan.root };
  } catch (error) {
    return { ok: false, message: PACK_TEXT.unpackFailed(reasonOf(error)) };
  }
};

export { unpackPackedProject };
