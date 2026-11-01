/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../palette-import/palette-import.constants';
import type { SourceColor } from '../../../palette-source/palette-source.type';
import type { ImportSummaryProps } from '../PaletteImportDialog.type';
import { ColourRow } from './ColourRow';

const hexes = (colours: readonly SourceColor[]): string[] => colours.map((colour) => colour.rgb);

const ImportSummary = ({ state, free }: ImportSummaryProps) => {
  const { source, plan, mode } = state;
  if (!source || !plan) {
    return <Text tone="muted">{IMPORT_TEXT.noSource}</Text>;
  }
  return (
    <Stack gap="sm" aria-live="polite">
      <Text variant="label">{IMPORT_TEXT.source(source.name, source.colors.length)}</Text>
      {plan.kept.length === 0 ? <Text tone="muted">{IMPORT_TEXT.nothing}</Text> : <ColourRow label={IMPORT_TEXT.keepLabel} colours={hexes(plan.kept)} />}
      {plan.present.length > 0 && mode === 'append' && <ColourRow label={IMPORT_TEXT.presentLabel} colours={hexes(plan.present)} />}
      {plan.present.length > 0 && mode === 'append' && <Text variant="caption" tone="muted">{IMPORT_TEXT.present(plan.present.length)}</Text>}
      {plan.over.length > 0 && <ColourRow label={IMPORT_TEXT.overLabel} colours={hexes(plan.over)} />}
      {plan.over.length > 0 && <Callout tone="warning">{IMPORT_TEXT.over(plan.over.length, free)}</Callout>}
    </Stack>
  );
};

export { ImportSummary };
