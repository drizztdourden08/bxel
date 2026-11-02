/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { LOSPEC_TEXT } from '../../../palette-import/lospec.constants';
import { IMPORT_TEXT } from '../../../palette-import/palette-import.constants';
import { hexesOf } from '../behavior/hexes-of';
import type { ImportSummaryProps } from '../PaletteImportDialog.type';
import { ColourRow } from './ColourRow';
import { OverRows } from './OverRows';
import { PresentRows } from './PresentRows';

const ImportSummary = ({ state, free }: ImportSummaryProps) => {
  const { source, plan, mode } = state;
  if (!source || !plan) {
    return <Text tone="muted">{IMPORT_TEXT.noSource}</Text>;
  }
  return (
    <Stack gap="sm" aria-live="polite">
      <Text variant="label">{IMPORT_TEXT.source(source.name, source.colors.length)}</Text>
      {source.author && <Text variant="caption" tone="muted">{LOSPEC_TEXT.by(source.author)}</Text>}
      {plan.kept.length === 0 ? <Text tone="muted">{IMPORT_TEXT.nothing}</Text> : <ColourRow label={IMPORT_TEXT.keepLabel} colours={hexesOf(plan.kept)} />}
      <PresentRows present={plan.present} mode={mode} />
      <OverRows over={plan.over} free={free} />
    </Stack>
  );
};

export { ImportSummary };
