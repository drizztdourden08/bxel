/* @layer renderer-app @kind constants */
import { all, any, animatedTile, clip, file, has, hasDocument, hasFile, not, surface, writable } from '../predicates.constants';
import { documentReason, REASON } from '../reasons.constants';
import type { Need, Pred } from '../ui-rule.type';

const PIXEL: Pred = surface('pixel');

const MAP: Pred = surface('map');

const SHEET: Pred = surface('sheet');

const TILE_FILES: Pred = file('tileset', 'tilemap');

const NONE_OR_PIXEL: Pred = any(surface('none'), PIXEL);

const DRAW_STAGE: Pred = any(surface('none'), PIXEL, MAP);

const EDIT_STAGE: Pred = any(PIXEL, MAP);

const ZOOM_STAGE: Pred = any(surface('none'), PIXEL, MAP, SHEET, surface('preview'));

const VIEW_STAGE: Pred = any(PIXEL, MAP, SHEET, surface('preview'));

const GRID_STAGE: Pred = any(PIXEL, MAP, surface('preview'));

const NOT_TILE_FILE: Pred = all(PIXEL, not(TILE_FILES));

const TIMELINE: Pred = any(file('animation'), all(TILE_FILES, PIXEL));

const ONION: Pred = any(file('animation'), all(TILE_FILES, PIXEL, animatedTile));

const DOC: Need = [hasDocument, documentReason];

const FILE: Need = [hasFile, REASON.noFile];

const DRAW: Need = [hasDocument, REASON.noDraw];

const WRITE: Need = [writable, REASON.readOnly];

const PIXELS_SELECTED: Need = [has('pixels'), REASON.noSelection];

const CELLS_SELECTED: Need = [has('cells'), REASON.noCells];

const ANY_SELECTED: Need = [has('pixels', 'cells'), REASON.noSelection];

const CLIPBOARD: Need = [clip('pixels'), REASON.emptyClipboard];

export {
  ANY_SELECTED, CELLS_SELECTED, CLIPBOARD, DOC, DRAW, DRAW_STAGE, EDIT_STAGE, FILE, GRID_STAGE, MAP, NONE_OR_PIXEL, NOT_TILE_FILE, ONION,
  PIXEL, PIXELS_SELECTED, SHEET, TILE_FILES, TIMELINE, VIEW_STAGE, WRITE, ZOOM_STAGE,
};
