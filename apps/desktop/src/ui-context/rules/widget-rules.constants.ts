/* @layer renderer-app @kind constants */
import { always, any, not, surface } from '../predicates.constants';
import { rule } from '../rule';
import type { UiRule } from '../ui-rule.type';
import { EDIT_STAGE, ONION, PIXEL, SHEET, TILE_FILES, VIEW_STAGE } from './groups.constants';

const WIDGET_RULES: Record<string, UiRule> = {
  'widget.layers': rule({ applies: any(EDIT_STAGE, SHEET) }),
  'widget.palette': rule({ applies: PIXEL }),
  'widget.timeline': rule({ applies: PIXEL }),
  'widget.options': rule({ applies: EDIT_STAGE }),
  'widget.tools': rule({ applies: any(EDIT_STAGE, SHEET) }),
  'widget.view': rule({ applies: VIEW_STAGE }),
  'viewpanel.navigator': rule({ applies: VIEW_STAGE }),
  'viewpanel.zoom': rule({ applies: VIEW_STAGE }),
  'viewpanel.overlays': rule({ applies: VIEW_STAGE }),
  'viewpanel.onion': rule({ applies: ONION }),
  'viewpanel.tiled': rule({ applies: PIXEL }),
  'viewpanel.symmetry': rule({ applies: PIXEL }),
  'viewpanel.background': rule({ applies: VIEW_STAGE }),
  'widget.sheet': rule({ applies: SHEET }),
  'widget.tileset': rule({ applies: TILE_FILES }),
  'widget.project': rule({ applies: always }),
  'toolbar.tools': rule({ applies: not(surface('palette')) }),
  'toolbar.canvas': rule({ applies: VIEW_STAGE }),
  'toolbar.options': rule({ applies: EDIT_STAGE }),
};

export { WIDGET_RULES };
