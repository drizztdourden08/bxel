/* @layer renderer-app @kind component */
import { usePaletteTarget } from '../../hooks/usePaletteTarget';
import { NoPalette } from './sub-components/NoPalette';
import { PaletteBody } from './sub-components/PaletteBody';
import './PalettePanel.css';

const PalettePanel = () => {
  const target = usePaletteTarget();
  return target ? <PaletteBody target={target} /> : <NoPalette />;
};

export { PalettePanel };
