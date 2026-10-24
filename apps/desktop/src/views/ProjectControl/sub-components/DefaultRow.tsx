/* @layer renderer-app @kind component */
import type { AssetDefaults } from '@bxel/project';
import { Button, Stack, Text } from '@drizztdourden08/tessera';
import { DEFAULTS_TEXT } from '../../../asset-defaults/asset-defaults.constants';
import { defaultText } from '../../../asset-defaults/default-text';
import { useAppDefaults } from '../../../asset-defaults/useAppDefaults';
import { useSourceValue } from '../../../config-source/useSourceValue';
import { PROJECT_SOURCE } from '../../../project-config/project-source.constants';
import { DefaultsEditor } from '../../DefaultsEditor';
import { usePaletteFiles } from '../behavior/usePaletteFiles';

const DefaultRow = ({ field }: { field: keyof AssetDefaults }) => {
  const key = `project.default.${field}`;
  const own = useSourceValue(PROJECT_SOURCE, key);
  const app = useAppDefaults();
  const files = usePaletteFiles().map((file) => ({ value: file.choice, label: file.name }));
  const unset = own === undefined;
  return (
    <Stack gap="xs">
      <DefaultsEditor field={field} value={unset ? app[field] : own} files={files} onChange={(value) => void PROJECT_SOURCE.set(key, value)} />
      {unset ? (
        <Text variant="caption" tone="muted">
          {DEFAULTS_TEXT.inheritValue(defaultText(field, app))}
        </Text>
      ) : (
        <Button size="sm" variant="tertiary" onClick={() => void PROJECT_SOURCE.set(key, undefined)}>
          {DEFAULTS_TEXT.reset}
        </Button>
      )}
    </Stack>
  );
};

export { DefaultRow };
