/* @layer renderer-app @kind test */
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { HELD_CHIPS } from '../../src/views/PalettePanel/PalettePanel.constants';
import { HeldRow } from '../../src/views/PalettePanel/sub-components/HeldRow';
import { RampsView } from '../../src/views/PalettePanel/sub-components/RampsView';
import { SwatchGrid } from '../../src/views/PalettePanel/sub-components/SwatchGrid';
import { SwatchList } from '../../src/views/PalettePanel/sub-components/SwatchList';
import { render } from './hint-harness';
import { fakePanel } from './palette-panel-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

describe('the palette widget', () => {
  it('shows one chip for each of the four held colours with its swatch index under it', () => {
    const html = render(createElement(HeldRow, { panel: fakePanel() }));
    for (const chip of HELD_CHIPS) expect(html).toContain(`aria-label="Colour ${chip.position}, Swatch`);
    expect(html).toContain('#3');
    expect(html).toContain('Swap colours 1 and 2');
    expect(html).toContain('Swap colour pairs');
  });

  it('makes the grid one listbox with one tab stop and numbered corner marks', () => {
    const panel = fakePanel();
    const html = render(createElement(SwatchGrid, { panel }));
    expect(html).toContain('role="listbox"');
    expect(html).toContain('aria-multiselectable="true"');
    expect(html.match(/role="option"/g)?.length).toBe(panel.slots.length);
    expect(html.match(/tabindex="0"/g)?.length).toBe(1);
    expect(html).toContain('colour 1 and 3');
    expect(html).toContain('swatch-mark--4');
    expect(html).toContain('aria-selected="true"');
  });

  it('disables Add colour at the limit and says why', () => {
    const panel = fakePanel();
    const { bank } = panel.target;
    const full = fakePanel({ target: { ...panel.target, bank: { ...bank, cap: bank.slots.length } } });
    const html = render(createElement(SwatchGrid, { panel: full }));
    expect(html).toContain(`Add colour. The palette holds its ${bank.slots.length} colours. Raise the limit to add one.`);
    expect(html).toMatch(/aria-label="Add colour\.[^"]*"[^>]*disabled|disabled[^>]*aria-label="Add colour\./);
  });

  it('lists every swatch with its hex and use in the list view', () => {
    const panel = fakePanel();
    const html = render(createElement(SwatchList, { panel }));
    for (const slot of panel.slots.filter((each) => !each.transparent)) expect(html).toContain(slot.hex);
    expect(html).toContain('Use');
  });

  it('shows the swatches outside any ramp and a New ramp button in the ramps view', () => {
    const html = render(createElement(RampsView, { panel: fakePanel() }));
    expect(html).toContain('Not in a ramp');
    expect(html).toContain('New ramp...');
  });
});
