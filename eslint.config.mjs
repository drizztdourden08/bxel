/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  presets: ['react-app'],
  inlineStyle: [{
    files: ['apps/desktop/src/views/TimelinePanel/sub-components/TagLane.tsx'],
    why: 'A tag colour is any hex colour the user or the MCP client saved in the document, so no fixed token class can carry it.',
  }, {
    files: ['apps/desktop/src/views/LayerStack/sub-components/LayerRow.tsx'],
    why: 'A layer colour tag is any hex colour the user or the MCP client saved in the document, so no fixed token class can carry it.',
  }, {
    files: ['apps/desktop/src/views/SpritesPanel/sub-components/SpriteRows.tsx'],
    why: 'The windowed sprite list sets its body height from the row count, and Tessera has no virtual grid with a header row, so no fixed token class can carry it.',
  }],
  ignores: ['**/.brock/**'],
});
