/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { COMMAND_ZONE } from '../../src/keymap/command-zone.constants';
import { TIMELINE_KEY_COMMANDS } from '../../src/keymap/timeline-key-commands.constants';
import { canonical, chordsOf, pairsOf, shares } from './chord-table';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

describe('the keys of the timeline zone', () => {
  it('all belong to the timeline zone and stay off while typing', () => {
    expect(TIMELINE_KEY_COMMANDS.length).toBeGreaterThan(15);
    expect(TIMELINE_KEY_COMMANDS.filter((def) => def.zone !== COMMAND_ZONE.timeline || def.whileTyping !== false)).toEqual([]);
  });

  it('use no chord twice', () => {
    const keys = TIMELINE_KEY_COMMANDS.flatMap(pairsOf).map((pair) => pair.key);
    expect(keys.filter((key, at) => keys.indexOf(key) !== at)).toEqual([]);
  });

  it('keep off the chords the app table gives the timeline zone', () => {
    const taken = APP_COMMANDS.filter((def) => shares(def.zone, COMMAND_ZONE.timeline) && def.zone !== undefined).flatMap((def) => chordsOf(def).map(canonical));
    const mine = TIMELINE_KEY_COMMANDS.flatMap(chordsOf).map(canonical);
    expect(mine.filter((chord) => taken.includes(chord))).toEqual([]);
  });

  it('put play on Enter in the zone and on Shift and Enter in the editor', () => {
    expect(TIMELINE_KEY_COMMANDS.find((def) => def.id === 'timeline.key_play')?.chord).toBe('Enter');
    const paint = APP_COMMANDS.find((def) => def.id === 'timeline.toggle_play_paint');
    expect(paint?.chord).toBe('Shift+Enter');
    expect(paint?.zone).toBeUndefined();
  });
});
