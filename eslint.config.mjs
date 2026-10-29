/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  presets: ['react-app'],
  inlineStyle: [{
    files: [
      'apps/desktop/src/views/TimelinePanel/sub-components/TagBarView.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/TagLanes.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/TimelineRuler.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/OnionHandles.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/TimelineBody.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/FrameTrack.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/FrameOption.tsx',
      'apps/desktop/src/views/TimelinePanel/sub-components/FrameThumb.tsx',
    ],
    why: 'A tag colour is any hex colour the user or the MCP client saved in the document, and the position and width of a frame, a tag bar or a playhead follow the duration of its frames and the zoom, so no fixed token class can carry them.',
  }, {
    files: ['apps/desktop/src/views/LayerStack/sub-components/LayerRow.tsx'],
    why: 'A layer colour tag is any hex colour the user or the MCP client saved in the document, so no fixed token class can carry it.',
  }, {
    files: ['apps/desktop/src/views/SpritesPanel/sub-components/SpriteRows.tsx'],
    why: 'The windowed sprite list sets its body height from the row count, and Tessera has no virtual grid with a header row, so no fixed token class can carry it.',
  }, {
    files: ['apps/desktop/src/views/SwatchStrip/SwatchStrip.tsx', 'apps/desktop/src/views/PalettePanel/sub-components/ChannelSlider.tsx'],
    why: 'A swatch colour is any hex value of the palette, and a channel track is a gradient of the colour being edited, so no fixed token class can carry them.',
  }],
  ignores: ['**/.brock/**'],
});
