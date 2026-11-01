/* @layer renderer-app @kind constants */
import { resizeActiveSprite } from '../../canvas-size/resize-active-sprite';
import { commitSpec } from '../../editor/pending/commit-spec';
import { rotateSpec } from '../../editor/transform/rotate-spec';
import { scaleSpec } from '../../editor/transform/scale-spec';
import type { ResizeSpec } from '../../sheet-manager/manager.type';
import type { Args, Direct } from './direct-commands.type';
import { cutStripDirect } from './cut-strip-direct';
import { duplicateNamedDirect } from './duplicate-named-direct';
import { moveToFolder } from './move-to-folder';
import { paletteDirect } from './palette-direct';
import { renameMany } from './rename-many';
import { setPalette } from './set-palette';
import { sliceDirect } from './slice-direct';

const NO_SPRITE = 'No sprite is open to change.';

const num = (args: Args, key: string): number => Number(args[key]);

const boundsOf = (args: Args): 'expand' | 'crop' => (args.bounds === 'expand' ? 'expand' : 'crop');

const DIRECT: Readonly<Record<string, Direct>> = {
  'transform.rotate': (args) => commitSpec(rotateSpec(num(args, 'angle'), boundsOf(args))),
  'transform.scale': (args) => commitSpec(scaleSpec(num(args, 'width'), num(args, 'height'), boundsOf(args))),
  'canvas.size': (args) =>
    resizeActiveSprite({ width: num(args, 'width'), height: num(args, 'height'), anchor: args.anchor as ResizeSpec['anchor'] }) ? null : 'The canvas size did not change.',
  'palette.delete_swatch': (args) => paletteDirect('delete', num(args, 'index'), null, null),
  'palette.merge_swatch': (args) => paletteDirect('merge', num(args, 'index'), num(args, 'into'), null),
  'sprite.rename_many': renameMany,
  'sprite.duplicate_named': duplicateNamedDirect,
  'sprite.move_to_folder': moveToFolder,
  'sprite.set_palette': setPalette,
  'sprite.slice': sliceDirect,
  'sprite.cut_strip': cutStripDirect,
  'palette.change_limit': (args) => paletteDirect('limit', 0, null, num(args, 'cap')),
};

export { DIRECT, NO_SPRITE };
