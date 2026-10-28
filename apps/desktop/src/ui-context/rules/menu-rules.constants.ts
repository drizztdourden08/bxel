/* @layer renderer-app @kind constants */
import { file } from '../predicates.constants';
import { rule } from '../rule';
import type { UiRule } from '../ui-rule.type';
import { EDIT_STAGE, FILE, GRID_STAGE, PIXEL, SHEET, ZOOM_STAGE } from './groups.constants';

const MENU_RULES: Record<string, UiRule> = {
  'menu.kind.sprite': rule({ applies: file('sprite') }),
  'menu.kind.animation': rule({ applies: file('animation') }),
  'menu.kind.palette': rule({ applies: file('palette') }),
  'menu.kind.sheet': rule({ applies: file('sheet') }),
  'menu.kind.tileset': rule({ applies: file('tileset') }),
  'menu.kind.tilemap': rule({ applies: file('tilemap') }),
  'menu.kind.image': rule({ applies: file('image') }),
  'menu.edit.transform': rule({ applies: PIXEL }),
  'menu.layer': rule({ applies: EDIT_STAGE }),
  'menu.palette': rule({ applies: PIXEL }),
  'menu.sheet.arrange': rule({ applies: SHEET }),
  'menu.view.zoom': rule({ applies: ZOOM_STAGE, needs: [FILE] }),
  'menu.view.grid': rule({ applies: GRID_STAGE }),
  'menu.view.symmetry': rule({ applies: PIXEL }),
  'menu.view.tiled': rule({ applies: PIXEL }),
};

export { MENU_RULES };
