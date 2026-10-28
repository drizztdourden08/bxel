/* @layer renderer-app @kind logic */
import { commands } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { beginPending } from '../../editor/pending/begin-pending';
import type { ManifestEntry } from '../command-manifest/manifest.type';
import { commandContext } from './command-context';
import type { Args } from './run-command.type';

const boundsOf = (args: Args): 'expand' | 'crop' => (args.bounds === 'expand' ? 'expand' : 'crop');

const prefilled = (id: string, args: Args): boolean => {
  if (id === 'transform.rotate' && typeof args.angle === 'number') return beginPending({ kind: 'rotate', angle: args.angle, bounds: boundsOf(args) }, true);
  if (id === 'transform.scale' && typeof args.width === 'number' && typeof args.height === 'number') {
    return beginPending({ kind: 'scale', width: args.width, height: args.height, bounds: boundsOf(args) }, true);
  }
  return false;
};

const openForOwner = async (def: CommandDef, entry: ManifestEntry, args: Args): Promise<string> => {
  if (!prefilled(def.id, args)) await commands.run(def.id, commandContext(args));
  return `dialog:${entry.dialog ?? def.id}`;
};

export { openForOwner };
