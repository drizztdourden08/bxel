/* @layer renderer-app @kind types */
import type { ShortcutKey, ToolbarChoices, ToolbarIcon, ToolbarItem, ToolbarNumber } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';

interface ToolbarPanelProps {
  label: string;
  items: readonly ToolbarItem[];
}

interface PanelItemProps {
  item: ToolbarItem;
}

interface PanelGroupProps {
  item: ToolbarChoices;
}

interface PanelNumberProps {
  item: ToolbarNumber;
}

interface PanelTipProps {
  name: string;
  description: string | undefined;
  shortcut: string | readonly ShortcutKey[] | undefined;
  children: ReactNode;
}

interface PanelButtonProps {
  icon: ToolbarIcon;
  label: string;
  tip: Omit<PanelTipProps, 'children'>;
  active: boolean | undefined;
  disabled: boolean | undefined;
  onPress: () => void;
}

export type { PanelButtonProps, PanelGroupProps, PanelItemProps, PanelNumberProps, PanelTipProps, ToolbarPanelProps };
