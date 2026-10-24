/* @layer renderer-app @kind hook */
import type { ListedEntry } from '@bxel/project';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { PROJECT_RENAME_KEY, PROJECT_TRASH_KEY } from '../../../keymap/zone-key.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const pickedEntry = (model: ProjectPanelModel): ListedEntry | null =>
  model.view === 'folders' ? (model.listing?.entries.find((entry) => entry.name === model.selected) ?? null) : null;

const useProjectKeys = (model: ProjectPanelModel): void => {
  const entry = pickedEntry(model);
  useZoneKey(PROJECT_RENAME_KEY, entry === null ? null : () => model.startRename(entry));
  useZoneKey(PROJECT_TRASH_KEY, entry === null ? null : () => model.trash(entry));
};

export { useProjectKeys };
