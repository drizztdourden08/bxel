/* @layer renderer-app @kind component */
import { MillerColumns } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { useColumnsTree } from '../behavior/useColumnsTree';
import { FileRow } from './FileRow';

const nameOf = (entry: BrowserEntry): string => (entry.kind === 'folder' ? entry.name : entry.row.name);

const ColumnsView = () => {
  const { model, actions } = useBrowserContext();
  const ids = useBrowserStore((state) => state.selection.ids);
  const picked = useMemo(() => new Set(ids), [ids]);
  const tree = useColumnsTree(model);
  return (
    <MillerColumns<BrowserEntry>
      className="browser-columns"
      label={BROWSER_TEXT.columnsLabel}
      items={tree.items}
      getKey={(entry) => entry.id}
      getChildren={tree.childrenOf}
      getLabel={nameOf}
      renderItem={(entry) => <FileRow entry={entry} column />}
      selection={{ selected: picked, onChange: tree.pick }}
      path={tree.path}
      onPathChange={tree.walk}
      onOpen={actions.open}
      columnWidth="size-192"
      rowSize="compact"
    />
  );
};

export { ColumnsView };
