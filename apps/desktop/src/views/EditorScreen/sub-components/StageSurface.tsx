/* @layer renderer-app @kind component */
import { useBxelContext } from '../../../ui-context/useBxelContext';
import { EditorCanvas } from '../../EditorCanvas';
import { ImageStage } from '../../ImageStage';
import { PaletteCard } from '../../PaletteCard';
import { SheetCanvas } from '../../SheetCanvas';
import { StartStage } from '../../StartStage';
import { TilemapCanvas } from '../../TilemapCanvas';

const StageSurface = () => {
  const surface = useBxelContext((context) => context.surface);
  if (surface === 'none') return <StartStage />;
  if (surface === 'preview') return <ImageStage />;
  if (surface === 'palette') return <PaletteCard />;
  if (surface === 'sheet') return <SheetCanvas />;
  return surface === 'map' ? <TilemapCanvas /> : <EditorCanvas />;
};

export { StageSurface };
