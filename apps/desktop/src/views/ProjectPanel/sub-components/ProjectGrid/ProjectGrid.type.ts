/* @layer renderer-app @kind types */
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { BrowserItem } from '../../../../project-browser/project-browser.type';
import type { PanelPartProps } from '../../ProjectPanel.type';

type GridTileProps = PanelPartProps & {
  readonly item: BrowserItem;
  readonly cell: VirtualGridCellBind;
};

export type { GridTileProps };
