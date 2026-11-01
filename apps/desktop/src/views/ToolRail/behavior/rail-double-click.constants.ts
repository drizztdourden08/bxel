/* @layer renderer-app @kind constants */
import type { ZoomStep } from '../../../editor/editor.type';

const RAIL_DOUBLE_CLICK: Readonly<Record<string, ZoomStep>> = {
  hand: 'fit',
  zoom: 'actual',
};

export { RAIL_DOUBLE_CLICK };
