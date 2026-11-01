/* @layer renderer-app @kind logic */
import { editProjectPresets } from './edit-project-presets';

const renameProjectPreset = (id: string, name: string): Promise<boolean> =>
  editProjectPresets((list) => list.map((each) => (each.id === id ? { ...each, name } : each)));

export { renameProjectPreset };
