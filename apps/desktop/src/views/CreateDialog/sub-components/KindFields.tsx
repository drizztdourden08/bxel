/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { PaletteFields } from '../../PaletteFields';
import type { CreateFieldsProps } from '../CreateDialog.type';
import { BackgroundField } from './BackgroundField';
import { BanksField } from './BanksField';
import { MapFields } from './MapFields';
import { PlatformField } from './PlatformField';
import { SheetFields } from './SheetFields';
import { SizeFields } from './SizeFields';

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

const KindFields = (props: CreateFieldsProps) => {
  const { form } = props;
  switch (form.kind) {
    case 'palette':
      return <PaletteBlock {...props} />;
    case 'tileset':
      return <SizeFields {...props} />;
    case 'tilemap':
      return <MapFields {...props} />;
    default:
      return (
        <>
          <PlatformField {...props} />
          {form.kind === 'sprite' ? <SizeFields {...props} /> : <SheetFields {...props} />}
          {props.inDocument === true ? (
            <Text variant="caption" tone="muted">{NEW_TEXT.inProject}</Text>
          ) : (
            <>
              <BackgroundField {...props} />
              <PaletteBlock {...props} />
              <BanksField {...props} />
            </>
          )}
        </>
      );
  }
};

export { KindFields };
