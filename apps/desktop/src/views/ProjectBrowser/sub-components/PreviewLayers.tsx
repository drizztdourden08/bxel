/* @layer renderer-app @kind component */
import { Box, Checkbox, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { PreviewLayersProps } from '../ProjectBrowser.type';

const PreviewLayers = ({ layers, flipped, onToggle }: PreviewLayersProps) => {
  if (layers.length === 0) return null;
  return (
    <Box className="browser-layers" role="group" aria-label={BROWSER_TEXT.layersTitle}>
      <Text as="span" variant="caption" tone="muted">
        {BROWSER_TEXT.layersTitle}
      </Text>
      {layers.map((layer) => (
        <Checkbox key={layer.id} size="sm" label={layer.name} aria-label={BROWSER_TEXT.layerToggle(layer.name)} checked={layer.visible !== flipped.has(layer.id)} onChange={() => onToggle(layer.id)} />
      ))}
    </Box>
  );
};

export { PreviewLayers };
