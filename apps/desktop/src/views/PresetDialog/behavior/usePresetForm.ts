/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { PresetDraft } from '../../../editor/presets/tool-preset.type';

interface PresetForm {
  name: string;
  ticked: readonly string[];
  setName: (name: string) => void;
  toggle: (id: string) => void;
  valid: boolean;
}

const usePresetForm = (draft: PresetDraft): PresetForm => {
  const [name, setName] = useState(draft.name);
  const [ticked, setTicked] = useState<readonly string[]>(draft.ticked);
  const toggle = (id: string): void => setTicked((now) => (now.includes(id) ? now.filter((each) => each !== id) : [...now, id]));
  return { name, ticked, setName, toggle, valid: name.trim() !== '' && ticked.length > 0 };
};

export { usePresetForm };
export type { PresetForm };
