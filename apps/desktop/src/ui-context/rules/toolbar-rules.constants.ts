/* @layer renderer-app @kind constants */
import { file, isolated } from '../predicates.constants';
import { ONLY } from '../reasons.constants';
import { rule } from '../rule';
import type { UiRule } from '../ui-rule.type';
import { EDIT_STAGE, GRID_STAGE, MAP, ONION, PIXEL, RULER_STAGE, TILE_FILES, VIEW_STAGE, WRITE } from './groups.constants';

const TOOLBAR_RULES: Record<string, UiRule> = {
  'item.back': rule({ applies: isolated, only: ONLY.sheets }),
  'item.paint-all': rule({ applies: PIXEL, only: ONLY.pixels }),
  'item.mirror-x': rule({ applies: PIXEL, only: ONLY.pixels }),
  'item.mirror-y': rule({ applies: PIXEL, only: ONLY.pixels }),
  'item.grid': rule({ applies: GRID_STAGE }),
  'item.gridMajor': rule({ applies: EDIT_STAGE }),
  'item.gridTile': rule({ applies: RULER_STAGE }),
  'item.rulers': rule({ applies: RULER_STAGE }),
  'item.guides': rule({ applies: RULER_STAGE }),
  'item.snap': rule({ applies: RULER_STAGE }),
  'item.tiled': rule({ applies: PIXEL, only: ONLY.pixels }),
  'item.onion': rule({ applies: ONION, only: ONLY.animations }),
  'item.play': rule({ applies: ONION, only: ONLY.animations }),
  'item.zoom-fit': rule({ applies: VIEW_STAGE }),
  'item.zoom-actual': rule({ applies: VIEW_STAGE }),
  'item.transform': rule({ applies: PIXEL, needs: [WRITE], only: ONLY.pixels }),
  'item.tile-mode': rule({ applies: file('tilemap'), only: ONLY.maps }),
  'item.map-collision': rule({ applies: TILE_FILES, only: ONLY.tiles }),
  'item.map-terrain': rule({ applies: MAP, only: ONLY.maps }),
  'item.map-animate': rule({ applies: MAP, only: ONLY.maps }),
};

export { TOOLBAR_RULES };
