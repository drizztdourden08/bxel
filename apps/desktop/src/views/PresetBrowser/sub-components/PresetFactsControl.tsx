/* @layer renderer-app @kind component */
import { presetById } from '../../../platform-preset/preset-by-id';
import { usePresetPickStore } from '../../../stores/usePresetPickStore';
import { PresetFacts } from './PresetFacts';

const PresetFactsControl = () => {
  const preset = presetById(usePresetPickStore((state) => state.picked));
  return preset === null ? null : <PresetFacts preset={preset} />;
};

export { PresetFactsControl };
