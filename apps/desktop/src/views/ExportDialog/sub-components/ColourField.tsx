/* @layer renderer-app @kind component */
import { Callout, Checkbox, Field, Paragraph, SegmentedControl } from '@drizztdourden08/tessera';
import { COLOUR_OPTIONS, EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { ColourFieldProps } from '../ExportDialog.type';

const ColourField = ({ settings, change, indexed }: ColourFieldProps) => {
  if (settings.kind === 'animation' && settings.animation === 'gif') {
    return (
      <Field label={EXPORT_DIALOG_TEXT.colour}>
        <Paragraph tone="dim">{EXPORT_DIALOG_TEXT.gifColour}</Paragraph>
      </Field>
    );
  }
  const asksApproval = indexed.state === 'available' && indexed.needsApproval && settings.colour === 'indexed' && settings.kind !== 'animation';
  return (
    <Field label={EXPORT_DIALOG_TEXT.colour}>
      <SegmentedControl
        size="sm"
        aria-label={EXPORT_DIALOG_TEXT.colour}
        value={settings.colour}
        options={COLOUR_OPTIONS.map((option) => ({
          ...option,
          disabled: option.value === 'indexed' && indexed.state === 'unavailable' ? indexed.note : false,
        }))}
        onChange={(colour) => change({ colour })}
      />
      {indexed.note !== '' && (
        <Callout variant="footnote" tone={indexed.state === 'available' ? 'info' : 'warning'}>
          {indexed.note}
        </Callout>
      )}
      {asksApproval && (
        <Checkbox size="sm" label={EXPORT_DIALOG_TEXT.approve} checked={settings.approved} onChange={(approved) => change({ approved })} />
      )}
    </Field>
  );
};

export { ColourField };
