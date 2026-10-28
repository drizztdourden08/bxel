/* @layer renderer-app @kind hook */
import { useSetAppContext, useShowFlags } from '@drizztdourden08/brock-react';
import { evaluate } from './evaluate';
import { useBxelContext } from './useBxelContext';
import { TOOLBAR_FLAG, WIDGET_CONTEXT } from './widget-context.constants';

const useWidgetRules = (): void => {
  const context = useBxelContext((current) => current);
  const visible = (id: string): boolean => evaluate(`widget.${id}`, context).state !== 'hidden';
  useSetAppContext(WIDGET_CONTEXT.layers, visible('layers'));
  useSetAppContext(WIDGET_CONTEXT.palette, visible('palette'));
  useSetAppContext(WIDGET_CONTEXT.timeline, visible('timeline'));
  useSetAppContext(WIDGET_CONTEXT.options, visible('options'));
  useSetAppContext(WIDGET_CONTEXT.tools, visible('tools'));
  useSetAppContext(WIDGET_CONTEXT.view, visible('view'));
  useSetAppContext(WIDGET_CONTEXT.sheet, visible('sheet'));
  useSetAppContext(WIDGET_CONTEXT.tileset, visible('tileset'));
  useShowFlags({
    [TOOLBAR_FLAG.tools]: visible('toolbar.tools'),
    [TOOLBAR_FLAG.canvas]: visible('toolbar.canvas'),
    [TOOLBAR_FLAG.options]: visible('toolbar.options'),
  });
};

export { useWidgetRules };
