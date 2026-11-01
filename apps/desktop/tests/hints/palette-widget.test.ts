/* @layer renderer-app @kind test */
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { HeldRow } from '../../src/views/PalettePanel/sub-components/HeldRow';
import { RampsView } from '../../src/views/PalettePanel/sub-components/RampsView';
import { SwatchGrid } from '../../src/views/PalettePanel/sub-components/SwatchGrid';
import { SwatchList } from '../../src/views/PalettePanel/sub-components/SwatchList';
import { render } from './hint-harness';
import { fakePanel } from './palette-panel-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

describe('S1 the palette widget', { tags: ['standard'] }, () => {
  it('disables Add colour at the limit and says why', () => {
    const panel = fakePanel();
    const { bank } = panel.target;
    const full = fakePanel({ target: { ...panel.target, bank: { ...bank, cap: bank.slots.length } } });
    const html = render(createElement(SwatchGrid, { panel: full }));
    expect(html).toContain(`Add colour. The palette holds its ${bank.slots.length} colours. Raise the limit to add one.`);
    expect(html).toMatch(/aria-label="Add colour\.[^"]*"[^>]*disabled|disabled[^>]*aria-label="Add colour\./);
  });
});
