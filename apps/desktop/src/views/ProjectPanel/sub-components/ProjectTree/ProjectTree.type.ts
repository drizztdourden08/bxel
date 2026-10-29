/* @layer renderer-app @kind types */
import type { BrowserItem, ItemStatus } from '../../../../panel-browser/project-browser.type';
import type { PanelPartProps } from '../../ProjectPanel.type';

type RowPartProps = PanelPartProps & {
  readonly item: BrowserItem;
  readonly status: ItemStatus;
};

type RowThumbProps = RowPartProps & { readonly expanded: boolean };

type RowNameProps = RowPartProps & { readonly count: number | undefined };

type RowEditorProps = RowPartProps & { readonly creating: boolean };

type BadgeMarks = {
  readonly readOnly: boolean;
  readonly missing: string | null;
  readonly unsaved: boolean;
  readonly open: boolean;
  readonly users: string | null;
  readonly usedBy: number;
};

type TreeExpansion = { readonly expanded: readonly string[]; readonly change: (keys: readonly string[]) => void };

type EditorDefaults = { readonly initial: string; readonly suffix: string; readonly label: string };

export type { BadgeMarks, EditorDefaults, RowEditorProps, RowNameProps, RowPartProps, RowThumbProps, TreeExpansion };
