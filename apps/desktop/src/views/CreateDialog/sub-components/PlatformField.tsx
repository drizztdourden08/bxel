/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import { changePlatform } from '../../../new-sprite/change-platform';
import { NO_PLATFORM, PLATFORM_TEXT } from '../../../platform-preset/platform-preset.constants';
import { PLATFORM_GROUPS } from '../CreateDialog.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const PlatformField = ({ form, update }: CreateFieldsProps) => (
  <Field label={PLATFORM_TEXT.label} hint={PLATFORM_TEXT.hint}>
    <Select searchable groups={PLATFORM_GROUPS} value={form.platformId ?? NO_PLATFORM} onChange={(value) => update(changePlatform(form, value))} />
  </Field>
);

export { PlatformField };
