/* @layer renderer-app @kind types */
import type { IconName, ShortcutKey, ToolbarChoices, ToolbarItem, ToolbarNumber } from '@drizztdourden08/tessera';
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
  icon: IconName;
  label: string;
  tip: Omit<PanelTipProps, 'children'>;
  active: boolean | undefined;
  disabled: boolean | undefined;
  onPress: () => void;
}

export type { PanelButtonProps, PanelGroupProps, PanelItemProps, PanelNumberProps, PanelTipProps, ToolbarPanelProps };
