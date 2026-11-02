/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { useHealthStore } from '../stores/useHealthStore';
import type { LinkFinding, LinkFix } from './project-health.type';
import { refreshHealth } from './refresh-health';
import { reloadOpenFiles } from './reload-open-files';
import { repairLinks } from './repair-links';
import { scanHealth } from './scan-health';

const byId = (finding: LinkFinding): LinkFix => ({ file: finding.file, linkId: finding.linkId, by: 'id' });

const repairMoved = async (moved: readonly LinkFinding[]): Promise<readonly LinkFinding[]> => {
  const kit = fileKit();
  const found = useHealthStore.getState().state;
  if (!kit || found.status !== 'ready' || moved.length === 0) return [];
  const fixes = moved.map(byId);
  const outcome = await repairLinks(kit.documents, found.index, fixes);
  const done = moved.filter((_, at) => !outcome.skipped.some((each) => each.fix === fixes[at]));
  if (outcome.fixed > 0) await reloadOpenFiles(kit, done.map((finding) => finding.file));
  return outcome.fixed > 0 ? done : [];
};

const repairOnLoad = async (): Promise<void> => {
  const { set, setRepaired } = useHealthStore.getState();
  setRepaired([]);
  const first = await scanHealth().catch(() => null);
  if (first === null) return refreshHealth();
  set(first);
  const repaired = await repairMoved(first.report.moved);
  if (repaired.length === 0) return;
  setRepaired(repaired);
  await refreshHealth();
};

export { repairOnLoad };
