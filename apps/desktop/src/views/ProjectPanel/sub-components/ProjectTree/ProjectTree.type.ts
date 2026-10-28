/* @layer renderer-app @kind types */
import type { VirtualMetrics } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import type { BrowserItem, ItemStatus, SelectionModel, VisibleRow } from '../../../../panel-browser/project-browser.type';
import type { PanelPartProps } from '../../ProjectPanel.type';

type RevealInput = {
  readonly request: SelectionModel['request'];
  readonly rows: readonly VisibleRow[];
  readonly metrics: VirtualMetrics;
  readonly rootRef: RefObject<HTMLElement | null>;
  readonly indices: readonly number[];
};

type TreeRowProps = PanelPartProps & {
  readonly row: VisibleRow;
  readonly index: number;
  readonly tabbable: boolean;
};

type RowPartProps = PanelPartProps & {
  readonly item: BrowserItem;
  readonly status: ItemStatus;
};

type RowLeadProps = RowPartProps & { readonly expanded: boolean | null };

type RowNameProps = RowPartProps & { readonly count: number | undefined };

type RowEditorProps = RowPartProps & { readonly creating: boolean };

type EditorDefaults = { readonly initial: string; readonly suffix: string; readonly label: string };

export type { EditorDefaults, RevealInput, RowEditorProps, RowLeadProps, RowNameProps, RowPartProps, TreeRowProps };
