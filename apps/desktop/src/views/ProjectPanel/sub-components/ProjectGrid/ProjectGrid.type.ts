/* @layer renderer-app @kind types */
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { BrowserItem } from '../../../../panel-browser/project-browser.type';
import type { PanelPartProps } from '../../ProjectPanel.type';

type GridTileProps = PanelPartProps & {
  readonly item: BrowserItem;
  readonly cell: VirtualGridCellBind;
};

type FilesDrop = (folder: BrowserItem, files: readonly File[]) => void;

type DropData = { readonly types: readonly string[]; readonly files: Iterable<File> };

type GridSection = {
  readonly key: string;
  readonly label: string;
  readonly items: BrowserItem[];
  readonly count: number;
  readonly onDropData?: (data: DropData) => void;
  readonly accepts?: (data: DropData) => boolean;
};

export type { DropData, FilesDrop, GridSection, GridTileProps };
