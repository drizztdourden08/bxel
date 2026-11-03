/* @layer renderer-app @kind test */
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AddTile } from '../../src/views/PalettePanel/sub-components/AddTile';
import { render } from './hint-harness';
import { fakePanel } from './palette-panel-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const cell: VirtualGridCellBind = {
  role: 'gridcell',
  className: 'virtual-grid__cell',
  tabIndex: -1,
  'aria-colindex': 1,
  'data-vg-index': 0,
  'data-vg-kind': 'tile',
  onFocus: () => undefined,
  onKeyDown: () => undefined,
};

describe('S1 the palette widget', { tags: ['standard'] }, () => {
  it('disables Add colour at the limit and says why', () => {
    const panel = fakePanel();
    const { bank } = panel.target;
    const full = fakePanel({ target: { ...panel.target, bank: { ...bank, cap: bank.slots.length } } });
    const html = render(createElement(AddTile, { panel: full, cell, reveal: () => undefined }));
    expect(html).toContain(`Add colour. The palette holds its ${bank.slots.length} colours. Raise the limit to add one.`);
    expect(html).toMatch(/aria-label="Add colour\.[^"]*"[^>]*disabled|disabled[^>]*aria-label="Add colour\./);
  });
});
