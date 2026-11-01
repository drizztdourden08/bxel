/* @layer renderer-app @kind logic */
import { itemLevel } from '@bxel/mcp';
import { commands } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { argsJson } from '../command-manifest/args-schemas.constants';
import { manifestOf } from '../command-manifest/manifest-of';
import type { ToolHandler } from '../assistant.type';
import { commandState } from './command-state';
import { offReason } from './off-reason';
import { reply } from './reply';
import type { ListCommandsInput } from './app-tool-input.type';

const chordOf = (id: string): string | null => commands.chords(id)[0] ?? null;

const matches = (def: CommandDef, query: string | undefined): boolean => {
  if (query === undefined) return true;
  const lower = query.toLowerCase();
  return def.id.toLowerCase().includes(lower) || def.label.toLowerCase().includes(lower);
};

const listCommands: ToolHandler = (input, context) => {
  const { area, query, includeDisabled, includeHidden } = input as ListCommandsInput;
  const { grant } = context.call.session;
  const rows = commands
    .list()
    .filter((def) => matches(def, query))
    .map((def) => ({ def, entry: manifestOf(def.id), state: commands.describe(def.id) }))
    .filter(({ entry }) => itemLevel(grant, 'run_command', entry.area) !== 'disabled')
    .filter(({ entry }) => area === undefined || entry.area === area)
    .map((row) => ({ ...row, ui: commandState(row.def.id, row.state.enabled) }))
    .filter(({ ui }) => includeHidden || ui.state !== 'hidden')
    .filter(({ state }) => includeDisabled || state.enabled)
    .map(({ def, entry, state, ui }) => ({
      id: def.id,
      label: def.label,
      group: def.group ?? null,
      area: entry.area,
      chord: chordOf(def.id),
      enabled: state.enabled,
      state: ui.state,
      only: ui.only,
      reason: state.enabled ? null : (state.reason ?? offReason()),
      checkable: def.checked !== undefined,
      checked: def.checked === undefined ? null : state.checked,
      effect: entry.effect,
      args: entry.args === null ? null : argsJson(entry.args),
      opensDialog: entry.dialog !== null,
    }));
  return reply({ ok: true, commands: rows, total: rows.length });
};

export { listCommands };
