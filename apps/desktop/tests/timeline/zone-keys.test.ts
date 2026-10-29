/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { zoneHandlesKey } from '../../src/views/TimelinePanel/behavior/zone-handles-key';

const press = (key: string, mods: { ctrlKey?: boolean; metaKey?: boolean } = {}) => ({ key, ctrlKey: false, metaKey: false, ...mods });

describe('the frame track keys that the timeline zone already binds', () => {
  it('leaves Ctrl and A and Escape to the zone commands so they run once', () => {
    expect(zoneHandlesKey(press('a', { ctrlKey: true }))).toBe(true);
    expect(zoneHandlesKey(press('A', { metaKey: true }))).toBe(true);
    expect(zoneHandlesKey(press('Escape'))).toBe(true);
  });

  it('keeps the other picking keys for the selection model', () => {
    expect(zoneHandlesKey(press('a'))).toBe(false);
    expect(zoneHandlesKey(press(' '))).toBe(false);
    expect(zoneHandlesKey(press('ArrowRight'))).toBe(false);
  });
});
