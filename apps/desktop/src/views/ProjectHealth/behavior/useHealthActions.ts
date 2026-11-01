/* @layer renderer-app @kind hook */
import { nav } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { PROJECT_HUB } from '../../../config-entry/config-entry.constants';
import { moveEntries } from '../../../file-ops/move-entries';
import { trashEntries } from '../../../file-ops/trash-entries';
import { applyLinkFixes } from '../../../project-health/apply-link-fixes';
import { refreshHealth } from '../../../project-health/refresh-health';
import type { LinkFinding, LinkFix } from '../../../project-health/project-health.type';
import { grantProjectFolder } from '../../../project/grant-project-folder';
import { revealInProjectWindow } from '../../../project-browser/reveal-in-project-window';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useHealthStore } from '../../../stores/useHealthStore';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { HealthActions } from '../ProjectHealth.type';

const fixOf = (finding: LinkFinding, by: 'id' | 'remove'): LinkFix => ({ file: finding.file, linkId: finding.linkId, by });

const showWith = (query: string): void => {
  useBrowserStore.getState().setQuery(query);
  nav.open(`${PROJECT_HUB}/browse`);
};

const useHealthActions = (): HealthActions =>
  useMemo<HealthActions>(
    () => ({
      fixLink: (finding, by) => void applyLinkFixes([fixOf(finding, by)]),
      fixMoved: () => {
        const state = useHealthStore.getState().state;
        if (state.status === 'ready') void applyLinkFixes(state.report.moved.map((finding) => fixOf(finding, 'id')));
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
