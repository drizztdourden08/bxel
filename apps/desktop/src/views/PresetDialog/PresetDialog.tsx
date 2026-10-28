/* @layer renderer-app @kind component */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { PresetDialogContent } from './sub-components/PresetDialogContent';

const PresetDialog = () => {
  const open = useToolPresetStore((state) => state.draft !== null);
  return open ? <PresetDialogContent /> : null;
};

export { PresetDialog };
