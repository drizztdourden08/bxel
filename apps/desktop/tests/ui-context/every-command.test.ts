/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { hasRule } from '../../src/ui-context/has-rule';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

describe('K1 every command has a rule', { tags: ['critical'] }, () => {
  it('registers no command id without a context rule', () => {
    const unruled = APP_COMMANDS.map((command) => command.id).filter((id) => !hasRule(id));
    expect(unruled).toEqual([]);
  });

  it('has a rule for each kind menu command of the Project widget', () => {
    const ids = [
      'asset.add_to_animation', 'asset.apply_palette', 'asset.new_tilemap_from', 'asset.open_sprites', 'asset.open_tileset',
      'asset.split_legacy', 'asset.unpack_project', 'asset.open_in_hub', 'asset.import_as_sprite', 'asset.import_as_tileset',
    ];
    for (const id of ids) expect(hasRule(id)).toBe(true);
  });
});
