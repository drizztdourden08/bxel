/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { PresetDraft } from '../../../editor/presets/tool-preset.type';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { PresetForm } from './usePresetForm.type';

const usePresetForm = (draft: PresetDraft): PresetForm => {
  const [name, setName] = useState(draft.name);
  const [ticked, setTicked] = useState<readonly string[]>(draft.ticked);
  const [inProject, setInProject] = useState(draft.inProject === true);
  const hasProject = useProjectStore((state) => state.project !== null);
  const toggle = (id: string): void => setTicked((now) => (now.includes(id) ? now.filter((each) => each !== id) : [...now, id]));
  return { name, ticked, inProject: inProject && hasProject, canProject: hasProject, setName, toggle, setInProject, valid: name.trim() !== '' && ticked.length > 0 };
};

export { usePresetForm };
