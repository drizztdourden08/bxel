/* @layer renderer-app @kind constants */
import { resizeActiveSprite } from '../../canvas-size/resize-active-sprite';
import { commitSpec } from '../../editor/pending/commit-spec';
import type { ResizeSpec } from '../../sheet-manager/manager.type';
import type { Args, Direct } from './direct-commands.type';
import { paletteDirect } from './palette-direct';

const NO_SPRITE = 'No sprite is open to change.';

const num = (args: Args, key: string): number => Number(args[key]);

const boundsOf = (args: Args): 'expand' | 'crop' => (args.bounds === 'expand' ? 'expand' : 'crop');

const DIRECT: Readonly<Record<string, Direct>> = {
  'transform.rotate': (args) => commitSpec({ kind: 'rotate', angle: num(args, 'angle'), bounds: boundsOf(args) }),
  'transform.scale': (args) => commitSpec({ kind: 'scale', width: num(args, 'width'), height: num(args, 'height'), bounds: boundsOf(args) }),
  'canvas.size': (args) =>
    resizeActiveSprite({ width: num(args, 'width'), height: num(args, 'height'), anchor: args.anchor as ResizeSpec['anchor'] }) ? null : 'The canvas size did not change.',
  'palette.delete_swatch': (args) => paletteDirect('delete', num(args, 'index'), null, null),
  'palette.merge_swatch': (args) => paletteDirect('merge', num(args, 'index'), num(args, 'into'), null),
  'palette.change_limit': (args) => paletteDirect('limit', 0, null, num(args, 'cap')),
};

export { DIRECT, NO_SPRITE };
