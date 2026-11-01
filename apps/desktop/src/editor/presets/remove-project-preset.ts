/* @layer renderer-app @kind logic */
import { editProjectPresets } from './edit-project-presets';

const removeProjectPreset = (id: string): Promise<boolean> => editProjectPresets((list) => list.filter((each) => each.id !== id));

export { removeProjectPreset };
