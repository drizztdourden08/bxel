/* @layer renderer-app @kind component */
import { presetById } from '../../../platform-preset/preset-by-id';
import { usePresetPickStore } from '../../../stores/usePresetPickStore';
import { PresetPreview } from './PresetPreview';

const PresetPreviewPane = () => {
  const preset = presetById(usePresetPickStore((state) => state.picked));
  return preset === null ? null : <PresetPreview preset={preset} />;
};

export { PresetPreviewPane };
