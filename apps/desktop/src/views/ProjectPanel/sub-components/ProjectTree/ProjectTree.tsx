/* @layer renderer-app @kind component */
import { Box, useVirtualWindow } from '@drizztdourden08/tessera';
import type { CSSProperties } from 'react';
import { useCallback, useRef } from 'react';
import { PANEL_UI, ROOT_DROP, ROW_INDEX_ATTRIBUTE } from '../../ProjectPanel.constants';
import type { PanelPartProps } from '../../ProjectPanel.type';
import { tabbableKey } from './behavior/tabbable-key';
import { useRevealRow } from './behavior/useRevealRow';
import { TreeRow } from './sub-components/TreeRow';
import './ProjectTree.css';

const ProjectTree = ({ model }: PanelPartProps) => {
  const { browser, selection, density, drag, rowActions } = model;
  const { rows } = browser;
  const rootRef = useRef<HTMLElement>(null);
  const keyAt = useCallback((index: number) => rows[index]?.item.key, [rows]);
  const windowed = useVirtualWindow({ enabled: true, count: rows.length, keyAt, rootRef, indexAttribute: ROW_INDEX_ATTRIBUTE, sizeKey: density });
  useRevealRow({ request: selection.request, rows, metrics: windowed.metrics, rootRef, indices: windowed.indices });
  const tabbable = tabbableKey(rows, selection);
  const sized = { '--tree-count': rows.length } as CSSProperties;
  const label = browser.mode === 'tree' ? PANEL_UI.treeLabel : PANEL_UI.listLabel;

  return (
    <Box ref={rootRef} className="project-tree" data-density={density} data-drop={drag.dropKey === ROOT_DROP} onScroll={windowed.onScroll} {...drag.dropProps(null)}>
      <Box
        ref={windowed.bodyRef}
        role="tree"
        aria-label={label}
        aria-multiselectable="true"
        className="project-tree__body"
        style={sized}
        onFocus={windowed.onFocus}
        onBlur={windowed.onBlur}
        onKeyDown={rowActions.keyDown}
      >
        {windowed.indices.map((at) => {
          const row = rows[at];
          return row === undefined ? null : <TreeRow key={row.item.key} model={model} row={row} index={at} tabbable={row.item.key === tabbable} />;
        })}
      </Box>
    </Box>
  );
};

export { ProjectTree };
