/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore, widgets } from '@drizztdourden08/brock-react';
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import type { OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { OPTIONS_WIDGET_ID } from '../../../tool-menu/tool-menu.constants';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';
import { MoreOptions } from '../sub-components/MoreOptions';

const panelShown = (): boolean => widgets.list().some((each) => each.id === OPTIONS_WIDGET_ID && each.visible);

const openPanel = (): void => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID);

const moreItem = (specs: readonly OptionSpec[]): ToolbarItem => {
  const base = { id: 'options-more', label: OPTIONS_TEXT.more, description: OPTIONS_TEXT.moreDescription, icon: 'sliders-horizontal' } as const;
  if (specs.length === 0 || panelShown()) return { ...base, kind: 'button', onSelect: openPanel };
  return {
    ...base,
    kind: 'popover',
    render: (close) =>
      createElement(MoreOptions, {
        specs,
        onOpenPanel: () => {
          close();
          openPanel();
        },
      }),
  };
};

export { moreItem };
