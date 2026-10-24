/* @layer renderer-app @kind test */
import { describe, test } from 'vitest';

describe('release checks that wait for features that are not built yet', () => {
  test.skip('check 5: import a padded grid sheet, name three sprites, paint one shared stroke, batch flip, undo each batch, save, reopen and export PNG with JSON (pending: sheet mode is being built)', () => undefined);

  test.skip('check 7: connect an MCP client, inspect, dry-run a batch, commit at a matching revision, reject a stale revision, undo in the UI and compare pixel hashes (pending: the MCP server is not built yet)', () => undefined);

  test.skip('check 6, tags and onion skin: build the tagged animation in the editor and reimport the export (pending: there is no timeline or frame editing UI, and image import reads PNG only)', () => undefined);

  test.skip('check 1, edit a swatch colour: change a swatch colour and reorder swatches in the palette panel (pending: the palette panel only picks colours; merge, delete and limit are covered by check 1)', () => undefined);
});
