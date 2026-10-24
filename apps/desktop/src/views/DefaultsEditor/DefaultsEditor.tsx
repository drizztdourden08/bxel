/* @layer renderer-app @kind component */
import { APP_ASSET_DEFAULTS } from '../../asset-defaults/asset-defaults.constants';
import type { DefaultsEditorProps } from './DefaultsEditor.type';
import { NumberEditor } from './sub-components/NumberEditor';
import { PaletteEditor } from './sub-components/PaletteEditor';
import { PlatformEditor } from './sub-components/PlatformEditor';
import { SizeEditor } from './sub-components/SizeEditor';
import { ToggleEditor } from './sub-components/ToggleEditor';

const DefaultsEditor = ({ field, value, files, onChange }: DefaultsEditorProps) => {
  switch (field) {
    case 'size':
      return <SizeEditor value={value} onChange={onChange} />;
    case 'colorLimit':
    case 'frameDurationMs':
      return <NumberEditor field={field} value={value} onChange={onChange} />;
    case 'palette':
      return <PaletteEditor value={value} files={files} onChange={onChange} />;
    case 'platformId':
      return <PlatformEditor value={value} onChange={onChange} />;
    case 'platformStrict':
    case 'transparent':
      return <ToggleEditor field={field} value={value} onChange={onChange} />;
    case 'pixelGrid':
      return <SizeEditor value={value} fallback={APP_ASSET_DEFAULTS.pixelGrid} onChange={onChange} />;
  }
};

export { DefaultsEditor };
