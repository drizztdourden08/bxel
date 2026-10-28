/* @layer renderer-app @kind component */
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Stack } from '@drizztdourden08/tessera';
import type { EditorTarget } from '../../../editor/editor.type';
import { usePaletteMenu } from '../behavior/usePaletteMenu';
import { usePanelModel } from '../behavior/usePanelModel';
import { useSwatchEdit } from '../behavior/useSwatchEdit';
import { PALETTE_MENU_ZONE } from '../PalettePanel.constants';
import { HeldRow } from './HeldRow';
import { NoPalette } from './NoPalette';
import { PaletteFooter } from './PaletteFooter';
import { PaletteHeader } from './PaletteHeader';
import { SharedNotice } from './SharedNotice';
import { SwatchEditor } from './SwatchEditor';
import { SwatchView } from './SwatchView';

const PaletteBody = ({ target }: { target: EditorTarget }) => {
  const editor = useSwatchEdit();
  const panel = usePanelModel(target, editor);
  usePaletteMenu(editor.open);
  if (!panel) return <NoPalette />;
  return (
    <Stack gap="sm" className="palette-panel" {...contextMenuZone(PALETTE_MENU_ZONE)}>
      <PaletteHeader panel={panel} />
      {panel.sharing.shared && <SharedNotice panel={panel} />}
      <HeldRow panel={panel} />
      <SwatchView panel={panel} />
      <PaletteFooter panel={panel} />
      <SwatchEditor panel={panel} />
    </Stack>
  );
};

export { PaletteBody };
