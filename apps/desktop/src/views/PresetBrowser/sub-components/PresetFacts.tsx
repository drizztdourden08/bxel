/* @layer renderer-app @kind component */
import { FactsPanel, Stack } from '@drizztdourden08/tessera';
import { presetFacts } from '../../../platform-preset/preset-facts';
import { PREVIEW_TEXT } from '../../../platform-preset/preset-facts.constants';
import { PRESET_BROWSER_TEXT } from '../PresetBrowser.constants';
import type { PresetPaneProps } from '../PresetBrowser.type';
import { NoteList } from './NoteList';

const PresetFacts = ({ preset }: PresetPaneProps) => (
  <Stack gap="md">
    <FactsPanel groups={presetFacts(preset)} layout="rows" label={PRESET_BROWSER_TEXT.factsLabel} />
    <NoteList title={PREVIEW_TEXT.notesTitle} lines={preset.notes} />
    <NoteList title={PREVIEW_TEXT.advisoryTitle} lines={preset.advisory} />
  </Stack>
);

export { PresetFacts };
