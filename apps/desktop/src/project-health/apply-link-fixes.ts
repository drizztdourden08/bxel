/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { useHealthStore } from '../stores/useHealthStore';
import { HEALTH_TEXT } from './project-health.constants';
import type { FixOutcome, LinkFix } from './project-health.type';
import { refreshHealth } from './refresh-health';
import { repairLinks } from './repair-links';

const tell = (outcome: FixOutcome): void => {
  if (outcome.fixed > 0) toast(HEALTH_TEXT.repaired(outcome.fixed), { variant: 'success' });
  else toast(outcome.skipped[0]?.reason ?? HEALTH_TEXT.nothingFixed, { variant: 'warning' });
};

const applyLinkFixes = async (fixes: readonly LinkFix[]): Promise<void> => {
  const kit = fileKit();
  const state = useHealthStore.getState().state;
  if (!kit || state.status !== 'ready') return;
  tell(await repairLinks(kit.documents, state.index, fixes));
  await refreshHealth();
};

export { applyLinkFixes };
