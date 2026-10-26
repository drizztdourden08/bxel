/* @layer renderer-app @kind component */
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import type { SwatchEditorProps } from '../PalettePanel.type';

const SwatchEditor = ({ editor }: SwatchEditorProps) => (
  <ColorPickerPopover
    open={editor.index !== null}
    anchorRef={editor.anchor}
    value={editor.value || '#000000'}
    alpha={editor.alpha}
    onAlphaChange={editor.changeAlpha}
    onChange={editor.change}
    onClose={editor.close}
  />
);

export { SwatchEditor };
