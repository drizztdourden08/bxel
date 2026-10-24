/* @layer renderer-app @kind component */
import { Disclosure, Field, SegmentedControl, Slider, Stack } from '@drizztdourden08/tessera';
import { DITHER_CHOICES, IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { ALPHA_RANGE } from '../ImportWizard.constants';
import type { WizardActionsProps } from '../ImportWizard.type';

const QualityFields = ({ wizard }: WizardActionsProps) => {
  const { form, update } = wizard;
  return (
    <Stack gap="sm">
      <Field label={IMPORT_TEXT.alpha} hint={IMPORT_TEXT.alphaHint(form.alphaPercent)}>
        <Slider
          aria-label={IMPORT_TEXT.alpha}
          min={ALPHA_RANGE.min}
          max={ALPHA_RANGE.max}
          step={ALPHA_RANGE.step}
          value={form.alphaPercent}
          showValue
          formatValue={(value) => `${value}%`}
          onChange={(alphaPercent) => update({ alphaPercent })}
        />
      </Field>
      <Disclosure summary={IMPORT_TEXT.advanced}>
        <Field label={IMPORT_TEXT.dither}>
          <SegmentedControl
            size="sm"
            aria-label={IMPORT_TEXT.dither}
            value={form.dither}
            options={DITHER_CHOICES}
            onChange={(dither) => update({ dither })}
          />
        </Field>
      </Disclosure>
    </Stack>
  );
};

export { QualityFields };
