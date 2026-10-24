/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  presets: ['react-app'],
  inlineStyle: [{
    files: ['apps/desktop/src/views/TimelinePanel/sub-components/TagLane.tsx'],
    why: 'A tag colour is any hex colour the user or the MCP client saved in the document, so no fixed token class can carry it.',
  }],
  ignores: ['**/.brock/**'],
});
