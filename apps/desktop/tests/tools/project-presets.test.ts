/* @layer renderer-app @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { allPresets } from '../../src/editor/presets/all-presets';
import { BUILTIN_PRESETS } from '../../src/editor/presets/builtin-presets.constants';
import { projectPresets } from '../../src/editor/presets/project-presets';
import { useProjectStore } from '../../src/stores/useProjectStore';

const PROJECT_PRESET = { id: 'project.chunky', name: 'Chunky', member: 'pencil', fields: { 'brush.size': 4 } };
const USER_PRESET = { id: 'user.mine', name: 'Mine', member: 'pencil', fields: { 'brush.size': 2 } };

const openProject = (toolPresets: readonly (typeof PROJECT_PRESET)[]): void => {
  useProjectStore.setState({ project: { manifest: { toolPresets } } as never });
};

describe('K3 project tool presets', { tags: ['critical'] }, () => {
  afterEach(() => useProjectStore.setState({ project: null }));

  it('are empty when no project is open', () => {
    expect(projectPresets()).toEqual([]);
    expect(allPresets([USER_PRESET])).toEqual([...BUILTIN_PRESETS, USER_PRESET]);
  });

  it('are marked as the project own', () => {
    openProject([PROJECT_PRESET]);
    expect(projectPresets()).toEqual([{ ...PROJECT_PRESET, project: true }]);
  });

  it('sit between the built in presets and the user presets', () => {
    openProject([PROJECT_PRESET]);
    const ids = allPresets([USER_PRESET]).map((preset) => preset.id);
    expect(ids.slice(-2)).toEqual(['project.chunky', 'user.mine']);
    expect(ids.slice(0, BUILTIN_PRESETS.length)).toEqual(BUILTIN_PRESETS.map((preset) => preset.id));
  });

  it('are left out when a caller passes its own list', () => {
    openProject([PROJECT_PRESET]);
    expect(allPresets([], []).length).toBe(BUILTIN_PRESETS.length);
  });
});
