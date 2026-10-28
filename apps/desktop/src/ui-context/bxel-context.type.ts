/* @layer renderer-app @kind types */
import type { ToolId } from '../editor/tool.type';

type FileType = 'none' | 'sprite' | 'animation' | 'palette' | 'sheet' | 'tileset' | 'tilemap' | 'image';

type StageSurface = 'none' | 'pixel' | 'sheet' | 'map' | 'palette' | 'preview';

type EditTarget = 'none' | 'sprite' | 'frame' | 'sheetSprite' | 'tile';

type TileEditing = 'place' | 'edit' | null;

type SelectionKind = 'none' | 'pixels' | 'cells' | 'sprites' | 'frames';

type ClipboardKind = 'none' | 'pixels' | 'cells';

interface BxelContext {
  readonly fileType: FileType;
  readonly surface: StageSurface;
  readonly editTarget: EditTarget;
  readonly tileMode: TileEditing;
  readonly isolated: boolean;
  readonly selection: SelectionKind;
  readonly clipboard: ClipboardKind;
  readonly pending: boolean;
  readonly tool: ToolId;
  readonly animatedTile: boolean;
  readonly readOnly: boolean;
  readonly projectOpen: boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

interface ContextInput {
  readonly tabKind: Exclude<FileType, 'none' | 'image'> | null;
  readonly imageActive: boolean;
  readonly isolated: boolean;
  readonly tileEdit: 'place' | 'edit';
  readonly pixelSelection: boolean;
  readonly cellSelection: boolean;
  readonly spriteSelection: number;
  readonly frameSelection: number;
  readonly clipboard: ClipboardKind;
  readonly pending: boolean;
  readonly tool: ToolId;
  readonly animatedTile: boolean;
  readonly readOnly: boolean;
  readonly projectOpen: boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export type { BxelContext, ContextInput, EditTarget, FileType, SelectionKind, StageSurface, TileEditing };
