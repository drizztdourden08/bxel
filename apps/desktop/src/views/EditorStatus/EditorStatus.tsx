/* @layer renderer-app @kind component */
import { StatusBar } from '@drizztdourden08/tessera';
import { statusItems } from '../../editor/status-items';
import { STATUS_TEXT } from '../../editor/status.constants';
import { useActiveDocument } from '../../hooks/useActiveDocument';
import { usePaletteSlots } from '../../hooks/usePaletteSlots';
import { useReadoutStore } from '../../stores/useReadoutStore';
import { useFileStore } from '../../stores/useFileStore';
import { useToolStore } from '../../stores/useToolStore';

const EditorStatus = () => {
  const view = useActiveDocument();
  const slots = usePaletteSlots();
  const pointer = useReadoutStore((state) => state.pointer);
  const zoom = useReadoutStore((state) => state.zoom);
  const foreground = useToolStore((state) => state.foreground);
  const recovered = useFileStore((state) => (view ? view.state.documentId in state.recovered : false));
  const colour = slots[foreground] ?? null;
  const clean = view?.clean ?? true;
  return <StatusBar label={STATUS_TEXT.region} items={statusItems({ pointer, zoom, colour, clean, recovered })} />;
};

export { EditorStatus };
