/* @layer renderer-app @kind test */
import { COMMAND_NAME, documentCommands } from '@bxel/document';
import { paletteCommands } from '@bxel/palette';
import { rasterCommands } from '@bxel/raster';
import { describe, expect, it, vi } from 'vitest';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';
import { APP_COMMANDS } from '../../src/documents/document-host.constants';
import { storePathBook } from '../../src/files/store-path-book';
import { setStrict } from '../../src/platform-preset/set-strict';
import { memoryDisk } from '../project/memory-disk';
import { toolContext } from '../project/tool-context';
import { artworkOf, chosen, platformFile, revisionOf, strictSnes } from './platform-harness';
import type { PlatformFile } from './platform-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const assistantEdit = (file: PlatformFile, tool: 'apply_edits' | 'preview_edits', steps: readonly object[]) => {
  const handler = TOOL_HANDLERS[tool];
  if (!handler) throw new Error(`no handler for ${tool}`);
  const context = toolContext({ host: file.host, paths: storePathBook(file.host), documents: memoryDisk().port });
  const input = { documentId: file.documentId, baseRevision: revisionOf(file), label: 'Assistant edit', steps, previewPixels: 0 };
  return Promise.resolve(handler(input, context)).then((reply) => reply.outcome);
};

const resize = (file: PlatformFile, cap: number): readonly object[] => [
  { name: COMMAND_NAME.paletteResize, targets: null, options: { bankId: artworkOf(file).banks[0]?.id, cap } },
];

describe('assistant edits on a file with Enforce platform rules on', () => {
  it('are blocked like the owner edits, with the same notice, and change nothing', async () => {
    const file = strictSnes();
    const before = revisionOf(file);
    const outcome = await assistantEdit(file, 'apply_edits', resize(file, 32));
    expect(outcome).toMatchObject({ ok: false, error: { code: 'PLATFORM_RULE' } });
    expect(JSON.stringify(outcome)).toContain('Turn off Enforce platform rules to allow it.');
    expect(revisionOf(file)).toBe(before);
    expect(artworkOf(file).banks[0]?.cap).toBe(16);
  });

  it('are reported by a preview too, so the assistant learns before it commits', async () => {
    const file = strictSnes();
    const outcome = await assistantEdit(file, 'preview_edits', resize(file, 32));
    expect(outcome).toMatchObject({ ok: false, error: { code: 'PLATFORM_RULE' } });
  });

  it('block a sprite of a size the platform cannot draw, and let a legal one through', async () => {
    const file = strictSnes();
    const odd = [{ name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'odd', width: 10, height: 10 } }];
    const legal = [{ name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'fine', width: 16, height: 16 } }];
    expect(await assistantEdit(file, 'apply_edits', odd)).toMatchObject({ ok: false, error: { code: 'PLATFORM_RULE' } });
    expect(await assistantEdit(file, 'apply_edits', legal)).toMatchObject({ ok: true });
  });

  it('go through once the owner turns the switch off', async () => {
    const file = strictSnes();
    setStrict(file.host, file.documentId, false);
    expect(await assistantEdit(file, 'apply_edits', resize(file, 32))).toMatchObject({ ok: true });
    expect(artworkOf(file).banks[0]?.cap).toBe(32);
  });

  it('cannot turn the switch off or move the platform, alone or inside a longer batch', async () => {
    const file = strictSnes();
    const update = (options: object) => ({ name: COMMAND_NAME.artworkUpdate, targets: null, options });
    const before = revisionOf(file);
    const off = await assistantEdit(file, 'apply_edits', [update({ platformStrict: false })]);
    expect(off).toMatchObject({ ok: false, error: { code: 'PLATFORM_RULE', step: 0, retry: 'after_owner' } });
    const none = await assistantEdit(file, 'apply_edits', [update({ platformId: null })]);
    expect(none).toMatchObject({ ok: false, error: { code: 'PLATFORM_RULE' } });
    const hidden = await assistantEdit(file, 'apply_edits', [...resize(file, 16), update({ platformStrict: false }), ...resize(file, 32)]);
    expect(hidden).toMatchObject({ ok: false, error: { code: 'PLATFORM_RULE', step: 1 } });
    expect(revisionOf(file)).toBe(before);
    expect(artworkOf(file).platformStrict).toBe(true);
  });

  it('may still rename the file and repeat the setting the file already has', async () => {
    const file = strictSnes();
    const rename = [{ name: COMMAND_NAME.artworkUpdate, targets: null, options: { name: 'Hero', platformStrict: true } }];
    expect(await assistantEdit(file, 'apply_edits', rename)).toMatchObject({ ok: true });
    expect(artworkOf(file).name).toBe('Hero');
  });

  it('are not touched on a file without the switch', async () => {
    const file = platformFile(chosen('snes-sprite'));
    expect(await assistantEdit(file, 'apply_edits', resize(file, 32))).toMatchObject({ ok: true });
  });
});

describe('the command set every host runs', () => {
  it('wraps every command in the guard, so no path to the engine skips it', () => {
    const sources = [...documentCommands, ...paletteCommands, ...rasterCommands];
    expect(APP_COMMANDS).toHaveLength(sources.length);
    APP_COMMANDS.forEach((command, at) => {
      expect(command.name).toBe(sources[at]?.name);
      expect(command.run).not.toBe(sources[at]?.run);
    });
  });
});
