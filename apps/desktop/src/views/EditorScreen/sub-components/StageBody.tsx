/* @layer renderer-app @kind component */
import { useBxelContext } from '../../../ui-context/useBxelContext';
import { EditorCanvas } from '../../EditorCanvas';
import { FileTypePicker } from '../../FileTypePicker';
import { ImageStage } from '../../ImageStage';
import { PaletteCard } from '../../PaletteCard';
import { SheetCanvas } from '../../SheetCanvas';
import { StartStage } from '../../StartStage';
import { TilemapCanvas } from '../../TilemapCanvas';
import type { StageBodyProps } from '../EditorScreen.type';

const StageBody = ({ adding }: StageBodyProps) => {
  const surface = useBxelContext((context) => context.surface);
  if (adding) return <FileTypePicker />;
  if (surface === 'none') return <StartStage />;
  if (surface === 'preview') return <ImageStage />;
  if (surface === 'palette') return <PaletteCard />;
  if (surface === 'sheet') return <SheetCanvas />;
  return surface === 'map' ? <TilemapCanvas /> : <EditorCanvas />;
};

export { StageBody };
