/* @layer renderer-app @kind component */
import { Tree } from '@drizztdourden08/tessera';
import type { TreeHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { isExpandable } from '../../../../panel-browser/is-expandable';
import { EMPTY_STATUS } from '../../../../panel-browser/project-browser.constants';
import type { BrowserItem } from '../../../../panel-browser/project-browser.type';
import { PANEL_UI } from '../../ProjectPanel.constants';
import type { PanelPartProps } from '../../ProjectPanel.type';
import { useRevealRow } from './behavior/useRevealRow';
import { useScrollOnSearch } from './behavior/useScrollOnSearch';
import { useTreeExpansion } from './behavior/useTreeExpansion';
import { RowLabel } from './sub-components/RowLabel';
import { RowThumb } from './sub-components/RowThumb';
import { RowTrail } from './sub-components/RowTrail';
import './ProjectTree.css';

const countOf = (item: BrowserItem, model: PanelPartProps['model']): number | undefined =>
  item.role === 'group' ? model.browser.nested.childrenOf(item)?.length : undefined;

const ProjectTree = ({ model }: PanelPartProps) => {
  const { browser, selection, density, drag, rowActions, data } = model;
  const handle = useRef<TreeHandle>(null);
  const expansion = useTreeExpansion(model);
  useRevealRow(selection.request, handle);
  useScrollOnSearch(model, handle);
  const statusOf = (item: BrowserItem) => data.statuses.get(item.key) ?? EMPTY_STATUS;
  const visible = browser.visible;

  return (
    <Tree<BrowserItem>
      ref={handle}
      className="project-tree"
      label={browser.mode === 'tree' ? PANEL_UI.treeLabel : PANEL_UI.listLabel}
      items={browser.nested.top}
      getKey={(item) => item.key}
      getChildren={browser.nested.childrenOf}
      getLabel={(item) => item.name}
      isBranch={isExpandable}
      expandedKeys={expansion.expanded}
      onExpandedChange={expansion.change}
      selection={{ selected: selection.keys, onChange: rowActions.picked, mode: 'multiple' }}
      openOnPick
      onActivate={(item) => !isExpandable(item) && rowActions.open(item)}
      filter={visible === null ? undefined : (item) => visible.has(item.key)}
      rowSize={density === 'compact' ? 'compact' : 'normal'}
      emptyLabel={PANEL_UI.emptyFolder}
      reorder={
        browser.mode === 'tree' && !browser.filtered
          ? {
              onMove: (move) => move.parentKey !== null && drag.moveKeys(move.keys, move.parentKey),
              canDrop: (move) => drag.canMoveInto(move.keys, move.parentKey),
            }
          : undefined
      }
      renderLead={(item, state) => <RowThumb model={model} item={item} status={statusOf(item)} expanded={state.expanded} />}
      renderLabel={(item) => <RowLabel model={model} item={item} status={statusOf(item)} count={countOf(item, model)} />}
      renderTrail={(item) => <RowTrail model={model} item={item} status={statusOf(item)} />}
    />
  );
};

export { ProjectTree };
