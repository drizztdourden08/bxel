/* @layer renderer-app @kind hook */
import { PRESETS } from '@bxel/mcp';
import type { BundleId, Grant, PresetId, TrustEntry } from '@bxel/mcp';
import { announce } from '@drizztdourden08/brock-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GRANT_TEXT_UI, LEVEL_NAME } from '../ProgramGrant.constants';
import { bundleRows } from './bundle-rows';
import type { PresetChoice } from './grant-rows.type';
import { omitTool } from './omit-tool';
import { presetGrant } from './preset-grant';
import { presetOf } from './preset-of';
import { shownLevel } from './shown-level';
import { toolRow } from './tool-row';
import { withBundleLevel } from './with-bundle-level';
import { withMayRestart } from './with-may-restart';
import { withToolLevel } from './with-tool-level';
import type { ProgramGrantModel } from './useProgramGrant.type';

const presetName = (choice: PresetChoice): string => (choice === 'blocked' ? GRANT_TEXT_UI.blockedLabel : PRESETS[choice as PresetId].label);

const useProgramGrant = (program: TrustEntry, onGrant: (key: string, grant: Grant) => void): ProgramGrantModel => {
  const { grant, key, displayName: name } = program;
  const [query, setQuery] = useState('');
  const rows = useMemo(() => bundleRows(grant, query), [grant, query]);
  const shown = rows.reduce((total, row) => total + row.tools.length, 0);
  const asked = useRef('');
  useEffect(() => {
    if (asked.current === query) return;
    asked.current = query;
    announce(GRANT_TEXT_UI.shown(shown));
  }, [query, shown]);
  const commit = (next: Grant, message: string): void => {
    onGrant(key, next);
    announce(message);
  };
  const overridesOf = (id: BundleId): number => bundleRows(grant, '').find((row) => row.id === id)?.overrides ?? 0;
  return {
    query,
    rows,
    shown,
    preset: presetOf(grant),
    setQuery,
    setPreset: (choice) => {
      const next = presetGrant(choice);
      if (next !== null) commit(next, GRANT_TEXT_UI.presetSet(presetName(choice), name));
    },
    setBundle: (id, level) => {
      const row = rows.find((each) => each.id === id);
      commit(withBundleLevel(grant, id, level), GRANT_TEXT_UI.groupSet(row?.label ?? id, LEVEL_NAME[level], name, overridesOf(id)));
    },
    setTool: (id, level) => {
      const next = withToolLevel(grant, id, level);
      const kept = toolRow(next, id);
      commit(next, kept.overridden ? GRANT_TEXT_UI.toolSet(id, LEVEL_NAME[shownLevel(level, kept.kind)], name) : GRANT_TEXT_UI.toolFollows(id, LEVEL_NAME[kept.level], name));
    },
    followBundle: (id) => {
      const next = omitTool(grant, id);
      commit(next, GRANT_TEXT_UI.toolFollows(id, LEVEL_NAME[toolRow(next, id).level], name));
    },
    setMayRestart: (on) => commit(withMayRestart(grant, on), on ? GRANT_TEXT_UI.restartOn(name) : GRANT_TEXT_UI.restartOff(name)),
  };
};

export { useProgramGrant };
