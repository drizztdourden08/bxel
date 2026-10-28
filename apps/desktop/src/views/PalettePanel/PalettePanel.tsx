/* @layer renderer-app @kind component */
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { NoPalette } from './sub-components/NoPalette';
import { PaletteBody } from './sub-components/PaletteBody';
import './PalettePanel.css';

const PalettePanel = () => {
  const target = useEditorTarget();
  return target ? <PaletteBody target={target} /> : <NoPalette />;
};

export { PalettePanel };
