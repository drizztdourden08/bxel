/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { PackingArgs, SetArgs, SlotArgs } from '../context-menu/menu-args.type';
import { useTilemapStore } from '../stores/useTilemapStore';
import { editSlot } from '../tilemap/terrain/edit-slot';
import { runFillLayout } from '../tilemap/terrain/run-fill-layout';
import { runFillTurning } from '../tilemap/terrain/run-fill-turning';
import { COMMAND_GROUP } from './keymap.constants';
import { TERRAIN_COMMAND as ID } from './terrain-command-id.constants';
import { ruled } from './ruled';

const TERRAIN_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleBrush,
    label: 'Turn the terrain brush on or off',
    group: COMMAND_GROUP.tilemap,
    checked: () => useTilemapStore.getState().terrainBrush,
    run: () => useTilemapStore.getState().setTerrainBrush(!useTilemapStore.getState().terrainBrush),
  },
  { id: ID.fillFromLayout, label: 'Fill the terrain set from the layout', group: COMMAND_GROUP.tilemap, run: (context?: CommandContext) => void runFillLayout(commandArgs<PackingArgs>(context).packing, commandArgs<PackingArgs>(context).set) },
  { id: ID.fillByTurning, label: 'Fill missing terrain slots by turning', group: COMMAND_GROUP.tilemap, run: (context?: CommandContext) => void runFillTurning(commandArgs<SetArgs>(context).set) },
  {
    id: ID.editSlot,
    label: 'Change a terrain slot',
    group: COMMAND_GROUP.tilemap,
    run: (context?: CommandContext) => {
      const args = commandArgs<SlotArgs>(context);
      if (args.slot !== undefined) void editSlot({ slot: args.slot, action: args.action ?? 'use', ...(args.key === undefined ? {} : { key: args.key }), ...(args.set === undefined ? {} : { set: args.set }) });
    },
  },
].map(ruled);

export { TERRAIN_COMMANDS };
