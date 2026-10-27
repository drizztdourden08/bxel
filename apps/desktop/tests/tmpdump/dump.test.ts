import { writeFileSync } from 'node:fs';
import { test, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

test('dump', () => {
  const rows = APP_COMMANDS.map((c) =>
    [c.id, c.label, c.group ?? '', Array.isArray(c.chord) ? c.chord.join('|') : (c.chord ?? ''), c.when ? 'when' : '', c.checked ? 'checked' : '', c.zone ?? ''].join('\t'),
  );
  writeFileSync('C:/Users/drizz/AppData/Local/Temp/claude/X--Bxel/fd0643c0-1346-4d0f-b339-1b7d626ccb01/scratchpad/cmds.tsv', rows.join('\n'));
});
