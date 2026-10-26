/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useCallback } from 'react';
import { paintPaletteStrip } from '../../../canvas-look/paint-palette-strip';
import { usePaintedCanvas } from '../../../hooks/usePaintedCanvas';
import { PREVIEW_TEXT } from '../../../platform-preset/preset-facts.constants';
import './PaletteStrip.css';

const PaletteStrip = ({ colours }: { colours: readonly string[] }) => {
  const draw = useCallback((canvas: HTMLCanvasElement) => paintPaletteStrip(canvas, colours), [colours]);
  const ref = usePaintedCanvas(draw);
  return <Canvas ref={ref} className="preset-browser__palette" role="img" aria-label={PREVIEW_TEXT.paletteLabel(colours.length)} />;
};

export { PaletteStrip };
