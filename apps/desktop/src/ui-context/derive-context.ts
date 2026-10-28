/* @layer renderer-app @kind logic */
import type { BxelContext, ContextInput, EditTarget, FileType, SelectionKind, StageSurface, TileEditing } from './bxel-context.type';

const fileTypeOf = (input: ContextInput): FileType => {
  if (input.imageActive) return 'image';
  const painting = input.isolated && (input.tabKind === 'sprite' || input.tabKind === 'sheet');
  return painting ? 'sheet' : (input.tabKind ?? 'none');
};

const surfaceOf = (fileType: FileType, input: ContextInput): StageSurface => {
  if (fileType === 'none') return 'none';
  if (fileType === 'image') return 'preview';
  if (fileType === 'palette') return 'palette';
  if (fileType === 'sheet') return input.isolated ? 'pixel' : 'sheet';
  if (fileType === 'tilemap' && input.tileEdit === 'place') return 'map';
  return 'pixel';
};

const targetOf = (fileType: FileType, surface: StageSurface): EditTarget => {
  if (surface !== 'pixel') return 'none';
  if (fileType === 'sprite') return 'sprite';
  if (fileType === 'animation') return 'frame';
  if (fileType === 'sheet') return 'sheetSprite';
  return 'tile';
};

const tileModeOf = (fileType: FileType, input: ContextInput): TileEditing => {
  if (fileType === 'tileset') return 'edit';
  return fileType === 'tilemap' ? input.tileEdit : null;
};

const selectionOf = (surface: StageSurface, input: ContextInput): SelectionKind => {
  if (surface === 'pixel') {
    if (input.pixelSelection) return 'pixels';
    return input.frameSelection > 0 ? 'frames' : 'none';
  }
  if (surface === 'map') return input.cellSelection ? 'cells' : 'none';
  if (surface === 'sheet') return input.spriteSelection > 0 ? 'sprites' : 'none';
  return 'none';
};

const liveInput = (fileType: FileType, input: ContextInput): ContextInput => {
  if (fileType !== 'none' && fileType !== 'image') return input;
  return { ...input, isolated: false, clipboard: 'none', pending: false, canUndo: false, canRedo: false, readOnly: fileType === 'image' };
};

const deriveContext = (raw: ContextInput): BxelContext => {
  const fileType = fileTypeOf(raw);
  const input = liveInput(fileType, raw);
  const surface = surfaceOf(fileType, input);
  return Object.freeze({
    fileType,
    surface,
    editTarget: targetOf(fileType, surface),
    tileMode: tileModeOf(fileType, input),
    isolated: input.isolated,
    selection: selectionOf(surface, input),
    clipboard: input.clipboard,
    pending: input.pending,
    tool: input.tool,
    animatedTile: (fileType === 'tileset' || fileType === 'tilemap') && input.animatedTile,
    readOnly: input.readOnly,
    projectOpen: input.projectOpen,
    canUndo: input.canUndo,
    canRedo: input.canRedo,
  });
};

export { deriveContext };
