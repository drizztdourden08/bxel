/* @layer renderer-app @kind hook */
import { useSetAppContext } from '@drizztdourden08/brock-react';
import { evaluate } from './evaluate';
import { useBxelContext } from './useBxelContext';
import { WIDGET_CONTEXT } from './widget-context.constants';

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
};

export { useWidgetRules };
