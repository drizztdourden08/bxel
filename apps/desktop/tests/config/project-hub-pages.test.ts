/* @layer renderer-app @kind test */
import type { Section } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { packCurrentProject } from '../../src/project/pack-current-project';
import exportSections, { meta as exportMeta } from '../../src/screens/project/project-settings/export.settings';
import generalSections from '../../src/screens/project/project-settings/general.settings';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());
vi.mock('../../src/project/pack-current-project', () => ({ packCurrentProject: vi.fn() }));

const itemsOf = (sections: readonly Section[]) => sections.flatMap((section) => section.items ?? []);

beforeEach(() => {
  vi.mocked(packCurrentProject).mockClear();
});

describe('the pages of the project hub', () => {
  it('General offers Pack project, which runs the pack flow', () => {
    const item = itemsOf(generalSections).find((each) => each.key === 'project.pack');
    const action = item?.actions?.find((each) => each.id === 'pack');
    expect(action?.label).toBe('Pack project...');
    void action?.onSelect({});
    expect(packCurrentProject).toHaveBeenCalledTimes(1);
  });

  it('Export comes last and holds the default scale and the file name template', () => {
    expect(itemsOf(exportSections).map((item) => item.key)).toEqual(['project.export.scale', 'project.export.pathTemplate']);
    expect(exportMeta.order).toBeGreaterThan(5);
    expect(exportMeta.title).toBe('Export');
  });
});
