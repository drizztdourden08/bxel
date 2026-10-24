/* @layer renderer-app @kind component */
import type { AssetDefaults } from '@bxel/project';
import { useSettings } from '@drizztdourden08/brock-react';
import { useAppDefaults } from '../../../asset-defaults/useAppDefaults';
import type { AppSettings } from '../../../settings.type';
import { DefaultsEditor } from '../../DefaultsEditor';

const AppDefaultRow = ({ field }: { field: keyof AssetDefaults }) => {
  const { patch } = useSettings<AppSettings>();
  const defaults = useAppDefaults();
  return <DefaultsEditor field={field} value={defaults[field]} onChange={(value) => patch({ assetDefaults: { ...defaults, [field]: value } })} />;
};

export { AppDefaultRow };
