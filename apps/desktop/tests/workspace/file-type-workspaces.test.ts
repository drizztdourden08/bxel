/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { FILE_TYPE_WORKSPACES } from '../../src/stage-layout/file-type-workspaces.constants';
import { CONTEXT_FLAGS } from '../../src/ui-context/context-flags.constants';
import { WORKSPACE_FLAG } from '../../src/ui-context/widget-context.constants';

vi.mock('@drizztdourden08/brock-react', () => ({ defineWorkspace: (input: object) => ({ ...input }) }));

const show = (fileType: string, sheet = false) => ({ flags: { [CONTEXT_FLAGS.fileType]: fileType, [WORKSPACE_FLAG.sheet]: sheet } }) as never;

const chosen = (fileType: string, sheet = false): string[] =>
  FILE_TYPE_WORKSPACES.filter((workspace) => workspace.when?.when?.(show(fileType, sheet))).map((workspace) => workspace.id);

describe('the workspaces, one per file type', () => {
  it('holds a workspace for sprites, animations, palettes, sheets, tilesets, tilemaps and images', () => {
    expect(FILE_TYPE_WORKSPACES.map((workspace) => workspace.id).sort()).toEqual(['animation', 'image', 'palette', 'sheet', 'sprite', 'tilemap', 'tileset']);
  });

  it('turns on exactly one workspace for the file type of the active tab', () => {
    expect(chosen('sprite')).toEqual(['sprite']);
    expect(chosen('animation')).toEqual(['animation']);
    expect(chosen('palette')).toEqual(['palette']);
    expect(chosen('tileset')).toEqual(['tileset']);
    expect(chosen('tilemap')).toEqual(['tilemap']);
    expect(chosen('image')).toEqual(['image']);
    expect(chosen('sheet', true)).toEqual(['sheet']);
  });

  it('keeps the base layout when nothing is open', () => {
    expect(chosen('none')).toEqual([]);
  });

  it('gives each workspace a label, an order and a layout of its own', () => {
    const orders = FILE_TYPE_WORKSPACES.map((workspace) => workspace.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect(FILE_TYPE_WORKSPACES.every((workspace) => workspace.label !== '' && workspace.layout !== undefined)).toBe(true);
  });
});
