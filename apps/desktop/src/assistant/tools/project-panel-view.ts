/* @layer renderer-app @kind logic */
import { useProjectStore } from '../../stores/useProjectStore';
import { useProjectPanelLinkStore } from '../../stores/useProjectPanelLinkStore';
import { placeOfPath } from './place-of-path';

const projectPanelView = () => {
  const { snapshot } = useProjectPanelLinkStore.getState();
  if (snapshot === null) return null;
  const { project } = useProjectStore.getState();
  return { mode: snapshot.mode, selection: snapshot.selection.flatMap((key) => placeOfPath(project, key) ?? []), search: snapshot.text, chips: [...snapshot.chips] };
};

export { projectPanelView };
