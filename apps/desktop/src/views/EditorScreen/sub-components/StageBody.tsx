/* @layer renderer-app @kind component */
import { EditorCanvas } from '../../EditorCanvas';
import { FileTypePicker } from '../../FileTypePicker';
import { SheetCanvas } from '../../SheetCanvas';
import { TilemapCanvas } from '../../TilemapCanvas';
import type { StageBodyProps } from '../EditorScreen.type';

const StageBody = ({ adding, mode, placing }: StageBodyProps) => {
  if (adding) return <FileTypePicker />;
  if (mode === 'sheet') return <SheetCanvas />;
  return placing ? <TilemapCanvas /> : <EditorCanvas />;
};

export { StageBody };
