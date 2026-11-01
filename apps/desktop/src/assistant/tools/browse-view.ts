/* @layer renderer-app @kind logic */
import { parseQuery } from '../../project-browser/parse-query';
import { useBrowserStore } from '../../project-browser/useBrowserStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { placeOfPath } from './place-of-path';

const browseView = () => {
  const { folder, view, query, selection, sort } = useBrowserStore.getState();
  const { project } = useProjectStore.getState();
  return {
    folder: folder === null ? null : placeOfPath(project, folder),
    view,
    sort: { key: sort.key, descending: sort.descending },
    search: query,
    chips: parseQuery(query).chips.map((chip) => chip.text),
    selection: selection.ids.flatMap((id) => placeOfPath(project, id) ?? []),
  };
};

export { browseView };
