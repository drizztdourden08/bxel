/* @layer renderer-app @kind component */
import type { CreateFieldsProps } from '../CreateDialog.type';
import { MapFields } from './MapFields';
import { PaletteBlock } from './PaletteBlock';
import { SizeFields } from './SizeFields';
import { SpriteKindFields } from './SpriteKindFields';

const KindFields = (props: CreateFieldsProps) => {
  switch (props.form.kind) {
    case 'palette':
      return <PaletteBlock {...props} />;
    case 'tileset':
      return <SizeFields {...props} />;
    case 'tilemap':
      return <MapFields {...props} />;
    case 'sprite':
    case 'sheet':
      return <SpriteKindFields {...props} />;
  }
};

export { KindFields };
