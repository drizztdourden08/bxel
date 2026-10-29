/* @layer renderer-app @kind hook */
import { nav, toast } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { PROJECT_HUB } from '../../../config-entry/config-entry.constants';
import { fileKit } from '../../../files/file-kit';
import { moveEntries } from '../../../file-ops/move-entries';
import { trashEntries } from '../../../file-ops/trash-entries';
import { repairLinks } from '../../../project-health/repair-links';
import { refreshHealth } from '../../../project-health/refresh-health';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { FixOutcome, LinkFinding, LinkFix } from '../../../project-health/project-health.type';
import { grantProjectFolder } from '../../../project/grant-project-folder';
import { revealInProjectWindow } from '../../../project-browser/reveal-in-project-window';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useHealthStore } from '../../../stores/useHealthStore';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { HealthActions } from '../ProjectHealth.type';

const tell = (outcome: FixOutcome): void => {
  if (outcome.fixed > 0) toast(HEALTH_TEXT.repaired(outcome.fixed), { variant: 'success' });
  else toast(outcome.skipped[0]?.reason ?? HEALTH_TEXT.nothingFixed, { variant: 'warning' });
};

const apply = async (fixes: readonly LinkFix[]): Promise<void> => {
  const kit = fileKit();
  const state = useHealthStore.getState().state;
  if (!kit || state.status !== 'ready') return;
  tell(await repairLinks(kit.documents, state.index, fixes));
  await refreshHealth();
};

const fixOf = (finding: LinkFinding, by: 'id' | 'remove'): LinkFix => ({ file: finding.file, linkId: finding.linkId, by });

const showWith = (query: string): void => {
  useBrowserStore.getState().setQuery(query);
  nav.open(`${PROJECT_HUB}/browse`);
};

const useHealthActions = (): HealthActions =>
  useMemo<HealthActions>(
    () => ({
      fixLink: (finding, by) => void apply([fixOf(finding, by)]),
      fixMoved: () => {
        const state = useHealthStore.getState().state;
        if (state.status === 'ready') void apply(state.report.moved.map((finding) => fixOf(finding, 'id')));
      },
      show: revealInProjectWindow,
      showUnsaved: () => showWith('is:unsaved'),
      showUnused: () => showWith('is:unused'),
      trashUnused: (findings) => void trashEntries(findings.map((each) => each.path)).then(() => refreshHealth()),
      moveToRole: (findings) => {
        void (async () => {
          for (const finding of findings) await moveEntries([finding.path], finding.folder);
          await refreshHealth();
        })();
      },
      regrant: (finding) => {
        const folder = useProjectStore.getState().project?.folders.find((each) => each.folderId === finding.folderId);
        if (folder) void grantProjectFolder(folder).then(() => refreshHealth());
      },
      recheck: () => void refreshHealth(),
    }),
    [],
  );

export { useHealthActions };
