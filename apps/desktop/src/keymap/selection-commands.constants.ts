/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { cancelPreview } from '../editor/pending/cancel-preview';
import { hasPreview } from '../editor/pending/has-preview';
import { clearSelection } from '../editor/selection/clear-selection';
import { copyMerged } from '../editor/selection/copy-merged';
import { copySelection } from '../editor/selection/copy-selection';
import { cutSelection } from '../editor/selection/cut-selection';
import { deleteSelection } from '../editor/selection/delete-selection';
import { invertSelection } from '../editor/selection/invert-selection';
import { pasteFromSystem } from '../editor/selection/paste-from-system';
import { reselect } from '../editor/selection/reselect';
import { alignSelection } from '../editor/selection/align-selection';
import { borderSelection } from '../editor/selection/border-selection';
import { fillSelection } from '../editor/selection/fill-selection';
import { resizeByAmount } from '../editor/selection/resize-by-amount';
import { pasteAndTransform } from '../editor/selection/paste-and-transform';
import { selectOpaque } from '../editor/selection/select-opaque';
import { smoothSelection } from '../editor/selection/smooth-selection';
import { strokeSelection } from '../editor/selection/stroke-selection';
import { selectAll } from '../editor/selection/select-all';
import { startFlip } from '../editor/transform/start-flip';
import { startTransform } from '../editor/transform/start-transform';
import { startRotate } from '../editor/transform/start-rotate';
import { startScale } from '../editor/transform/start-scale';
import { startTurn } from '../editor/transform/start-turn';
import { hasActiveDocument } from '../files/has-active-document';
import { enterAction } from '../sheet/enter-action';
import { enterReady } from '../sheet/enter-ready';
import { useSelectionNamesStore } from '../stores/useSelectionNamesStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { clearCells } from '../tilemap/clear-cells';
import { selectAllCells } from '../tilemap/select-all-cells';
import { turnCells } from '../tilemap/turn-cells';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { mapOr } from './map-or';
import { SELECTION_COMMAND_ID as ID } from './selection-command-id.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.edit;
const zone = COMMAND_ZONE.canvas;

const SELECTION_EDITS: readonly CommandDef[] = [
  { id: ID.selectAll, label: 'Select all', group, chord: 'Mod+A', zone, whileTyping: false, run: mapOr(selectAllCells, selectAll) },
  {
    id: ID.clear,
    label: 'Deselect',
    group,
    chord: 'Mod+D',
    whileTyping: false,
    run: mapOr(() => useTilemapStore.getState().setSelection(null), clearSelection),
  },
  { id: ID.invert, label: 'Invert selection', group, chord: 'Mod+Shift+I', whileTyping: false, run: () => void invertSelection() },
  { id: ID.reselect, label: 'Reselect', group, chord: 'Mod+Alt+D', whileTyping: false, run: () => void reselect() },
  { id: ID.save, label: 'Saved selections...', group, run: () => useSelectionNamesStore.getState().show() },
  { id: ID.expand, label: 'Expand selection', group, chord: 'Mod+Alt+=', whileTyping: false, run: () => void resizeByAmount(1) },
  { id: ID.shrink, label: 'Shrink selection', group, chord: 'Mod+Alt+-', whileTyping: false, run: () => void resizeByAmount(-1) },
  { id: ID.border, label: 'Border selection', group, run: () => void borderSelection() },
  { id: ID.smooth, label: 'Smooth selection', group, run: () => void smoothSelection() },
  { id: ID.selectOpaque, label: 'Select opaque pixels of the layer', group, run: () => void selectOpaque() },
  { id: ID.strokeInside, label: 'Stroke selection inside', group, run: () => void strokeSelection('inside') },
  { id: ID.strokeOutside, label: 'Stroke selection outside', group, run: () => void strokeSelection('outside') },
  { id: ID.fillFront, label: 'Fill selection with the front colour', group, chord: 'Alt+Delete', whileTyping: false, run: () => void fillSelection('foreground') },
  { id: ID.fillBack, label: 'Fill selection with the back colour', group, chord: 'Mod+Delete', whileTyping: false, run: () => void fillSelection('background') },
  { id: ID.alignLeft, label: 'Align left', group, run: () => void alignSelection('left') },
  { id: ID.alignCentre, label: 'Align centre', group, run: () => void alignSelection('centre') },
  { id: ID.alignRight, label: 'Align right', group, run: () => void alignSelection('right') },
  { id: ID.alignTop, label: 'Align top', group, run: () => void alignSelection('top') },
  { id: ID.alignMiddle, label: 'Align middle', group, run: () => void alignSelection('middle') },
  { id: ID.alignBottom, label: 'Align bottom', group, run: () => void alignSelection('bottom') },
  { id: ID.pasteAsLayer, label: 'Paste as new layer', group, run: () => void pasteFromSystem('layer') },
  { id: ID.pasteIntoSelection, label: 'Paste into selection', group, run: () => void pasteFromSystem('selection') },
  { id: ID.pasteTransform, label: 'Paste and transform', group, run: () => void pasteAndTransform() },
  { id: ID.pasteExpand, label: 'Paste and expand the canvas', group, run: () => void pasteFromSystem('expand') },
  { id: ID.copy, label: 'Copy', group, chord: 'Mod+C', whileTyping: false, run: () => void copySelection() },
  { id: ID.cut, label: 'Cut', group, chord: 'Mod+X', whileTyping: false, run: () => void cutSelection() },
  { id: ID.paste, label: 'Paste', group, chord: 'Mod+V', whileTyping: false, run: () => void pasteFromSystem('pointer') },
  { id: ID.pasteInPlace, label: 'Paste in place', group, chord: 'Mod+Shift+V', whileTyping: false, run: () => void pasteFromSystem('place') },
  { id: ID.copyMerged, label: 'Copy merged', group, chord: 'Mod+Shift+C', whileTyping: false, run: () => void copyMerged() },
  {
    id: ID.delete,
    label: 'Delete',
    group,
    chord: 'Delete',
    zone,
    whileTyping: false,
    run: mapOr(clearCells, deleteSelection),
  },
];

const PREVIEW_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.apply,
    label: 'Apply',
    group,
    chord: 'Enter',
    whileTyping: false,
    when: () => hasActiveDocument() && enterReady(),
    run: enterAction,
  },
  {
    id: ID.cancel,
    label: 'Cancel',
    group,
    when: () => hasActiveDocument() && hasPreview(),
    run: () => void cancelPreview(),
  },
];

const TRANSFORM_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.flipHorizontal,
    label: 'Flip horizontal',
    group,
    chord: 'Shift+H',
    whileTyping: false,
    run: mapOr(() => turnCells('flipX'), () => startFlip('horizontal')),
  },
  {
    id: ID.flipVertical,
    label: 'Flip vertical',
    group,
    chord: 'Shift+V',
    whileTyping: false,
    run: mapOr(() => turnCells('flipY'), () => startFlip('vertical')),
  },
  {
    id: ID.turnClockwise,
    label: 'Rotate 90 clockwise',
    group,
    chord: 'Shift+R',
    whileTyping: false,
    run: mapOr(() => turnCells('turn'), () => startTurn('clockwise')),
  },
  {
    id: ID.turnCounterClockwise,
    label: 'Rotate 90 counterclockwise',
    group,
    chord: 'Shift+Alt+R',
    whileTyping: false,
    run: () => void startTurn('counter-clockwise'),
  },
  { id: ID.turnHalf, label: 'Rotate 180', group, chord: 'Mod+Shift+R', whileTyping: false, run: () => void startTurn('half') },
  { id: ID.transform, label: 'Transform', group, chord: 'Mod+T', whileTyping: false, run: () => void startTransform() },
  { id: ID.rotate, label: 'Rotate...', group, run: () => void startRotate() },
  { id: ID.scale, label: 'Scale...', group, run: () => void startScale() },
];

const SELECTION_COMMANDS: readonly CommandDef[] = [...SELECTION_EDITS, ...PREVIEW_COMMANDS, ...TRANSFORM_COMMANDS].map(ruled);

export { SELECTION_COMMANDS };
