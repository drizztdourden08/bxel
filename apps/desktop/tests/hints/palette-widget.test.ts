/* @layer renderer-app @kind test */
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { paletteSlots } from '../../src/editor/palette-slots';
import { openEditor } from '../editor/editor-harness';
import { HELD_CHIPS } from '../../src/views/PalettePanel/PalettePanel.constants';
import { HeldRow } from '../../src/views/PalettePanel/sub-components/HeldRow';
import { SwatchGrid } from '../../src/views/PalettePanel/sub-components/SwatchGrid';
import { render } from './hint-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const held ={ foreground: 3, background: 0, third: 3, fourth: 7 };

const slots = () => paletteSlots(openEditor().target().bank);

describe('the palette widget', () => {
  it('shows one chip for each of the four held colours with its drawing keys under it', () => {
    const html = render(createElement(HeldRow, { slots: slots(), held, onEdit: () => undefined }));
    for (const chip of HELD_CHIPS) expect(html).toContain(`aria-label="Colour ${chip.position}, Swatch`);
    expect(html.match(/<kbd/g)?.length).toBeGreaterThanOrEqual(4);
    expect(html).toContain('Shift');
  });

  it('fills the grid with every swatch and marks the held colours by their numbers', () => {
    const all = slots();
    const html = render(createElement(SwatchGrid, { slots: all, held, onEdit: () => undefined }));
    expect(html.match(/class="color-swatch/g)?.length).toBe(all.length);
    expect(html).toContain('colour 1 and 3');
    expect(html).toContain('colour 4');
  });

  it('keeps the management controls out of the widget', () => {
    const html = render(createElement(HeldRow, { slots: slots(), held, onEdit: () => undefined })) + render(createElement(SwatchGrid, { slots: slots(), held, onEdit: () => undefined }));
    for (const word of ['Platform', 'Snap', 'Swatch set', 'Add colours', 'Replace colours']) expect(html).not.toContain(word);
  });
});
