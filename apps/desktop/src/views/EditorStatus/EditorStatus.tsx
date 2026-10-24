/* @layer renderer-app @kind component */
import { StatusBar } from '@drizztdourden08/tessera';
import { statusItems } from '../../editor/status-items';
import { STATUS_TEXT } from '../../editor/status.constants';
import { useActiveAsset } from '../../hooks/useActiveAsset';
import { useActiveDocument } from '../../hooks/useActiveDocument';
import { usePaletteSlots } from '../../hooks/usePaletteSlots';
import { useReadoutStore } from '../../stores/useReadoutStore';
import { useFileStore } from '../../stores/useFileStore';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useToolStore } from '../../stores/useToolStore';
import { ActionHint } from '../ActionHint';
import { canvasHelp } from './behavior/canvas-help';
import './EditorStatus.css';

const EditorStatus = () => {
  const view = useActiveDocument();
  const slots = usePaletteSlots();
  const pointer = useReadoutStore((state) => state.pointer);
  const zoom = useReadoutStore((state) => state.zoom);
  const foreground = useToolStore((state) => state.foreground);
  const background = useToolStore((state) => state.background);
  const tool = useToolStore((state) => state.tool);
  const mode = useSpriteStore((state) => state.mode);
  const tileMode = useTilemapStore((state) => state.editMode);
  const recovered = useFileStore((state) => (view ? view.state.documentId in state.recovered : false));
  const colours = [slots[foreground] ?? null, slots[background] ?? null] as const;
  const asset = useActiveAsset();
  const clean = asset ? !asset.dirty : true;
  return (
    <ActionHint hint={canvasHelp(tool, mode, tileMode)} placement="top" className="editor-status">
      <StatusBar className="editor-status__bar" label={STATUS_TEXT.region} items={statusItems({ pointer, zoom, colours, clean, recovered })} />
    </ActionHint>
  );
};

export { EditorStatus };
