/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { PaletteFields } from '../../PaletteFields';
import type { CreateFieldsProps } from '../CreateDialog.type';

const PaletteBlock = ({ form, errors, update }: CreateFieldsProps) => (
  <>
    <Text variant="label">{NEW_TEXT.palette}</Text>
    <PaletteFields
      value={{ source: form.source, limit: form.limit, transparent: form.transparent }}
      limitError={errors.limit}
      paletteError={errors.palette}
      withSource
      onChange={update}
    />
  </>
);

export { PaletteBlock };
