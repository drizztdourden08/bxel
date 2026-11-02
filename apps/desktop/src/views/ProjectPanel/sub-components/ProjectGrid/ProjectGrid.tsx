/* @layer renderer-app @kind component */
import { VirtualGrid } from '@drizztdourden08/tessera';
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import { useCallback, useMemo } from 'react';
import { useEffectiveDefaults } from '../../../../asset-defaults/useEffectiveDefaults';
import { dropFiles } from '../../../../file-ops/drop-files';
import type { BrowserItem } from '../../../../panel-browser/project-browser.type';
import { PANEL_UI, TILE_BOX } from '../../ProjectPanel.constants';
import type { PanelPartProps } from '../../ProjectPanel.type';
import { GridTile } from './sub-components/GridTile';
import { sectionsOf } from './behavior/sections-of';
import './ProjectGrid.css';

const ProjectGrid = ({ model }: PanelPartProps) => {
  const { browser, view } = model;
  const defaults = useEffectiveDefaults();
  const flat = browser.rows.every((row) => row.expanded === null);
  const onFiles = useCallback((folder: BrowserItem, files: readonly File[]) => void dropFiles(files, folder.path, defaults), [defaults]);
  const sections = useMemo(() => sectionsOf(browser.rows, onFiles), [browser.rows, onFiles]);
  const items = useMemo(() => browser.rows.map((row) => row.item), [browser.rows]);
  const box = TILE_BOX[view.tile];
  const common = {
    label: PANEL_UI.gridLabel,
    getKey: (item: BrowserItem) => item.key,
    tileWidth: box.width,
    tileHeight: box.height,
    className: 'project-grid',
    renderTile: (item: BrowserItem, _index: number, cell: VirtualGridCellBind) => <GridTile model={model} item={item} cell={cell} />,
  };
  if (flat) return <VirtualGrid {...common} items={items} />;
  return <VirtualGrid {...common} sections={sections} collapsed={[...view.collapsedGroups]} onToggleSection={(key) => view.toggleGroup(key)} />;
};

export { ProjectGrid };
