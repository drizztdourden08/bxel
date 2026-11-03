/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { rootItem } from '../../src/panel-browser/root-item';
import { PANEL_UI } from '../../src/views/ProjectPanel/ProjectPanel.constants';
import { trailParts } from '../../src/views/ProjectPanel/sub-components/ProjectTree/behavior/trail-parts';

describe('W10 the row of a folder that cannot be read', { tags: ['standard'] }, () => {
  it('offers Allow access and Remove the link on a linked folder that is not granted', () => {
    expect(trailParts(rootItem({ path: '/p/shared', name: 'shared', main: false, granted: false }))).toEqual({ grant: true, unlink: true });
  });

  it('offers only Allow access on the main folder, which cannot be unlinked', () => {
    expect(trailParts(rootItem({ path: '/p/demo', name: 'demo', main: true, granted: false }))).toEqual({ grant: true, unlink: false });
  });

  it('offers neither on a folder that is granted', () => {
    expect(trailParts(rootItem({ path: '/p/shared', name: 'shared', main: false, granted: true }))).toEqual({ grant: false, unlink: false });
  });
});

describe('W10 the search help of the Project panel', { tags: ['standard'] }, () => {
  it('lists both directions of the reference tokens and the used alias', () => {
    expect(PANEL_UI.searchHelp).toContain('used:name');
    expect(PANEL_UI.searchHelp).toContain('usedby:name');
  });
});
