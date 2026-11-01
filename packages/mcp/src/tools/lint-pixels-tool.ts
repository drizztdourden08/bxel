/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, FRAME_ID_SCHEMA, REVISION_SCHEMA, SPRITE_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const rule = z.enum(['orphan', 'double', 'banding']);

const finding = z.strictObject({
  rule,
  x: COUNT_SCHEMA,
  y: COUNT_SCHEMA,
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  index: COUNT_SCHEMA,
});

const lintPixelsTool = defineTool(TOOL_NAME.lintPixels, {
  title: 'Lint pixels',
  description:
    'Checks the flattened frame of a sprite for pixel art flaws and returns where they are, without changing anything. orphan: a pixel with no neighbour of its own index in the ring of eight. double: the corner pixel of a one pixel line that pixel perfect drawing would drop. banding: parallel runs of three or more pixels in different colours that stack three or more deep with the same extent. Each finding is a rectangle with the index it concerns.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    spriteId: SPRITE_ID_SCHEMA,
    frameId: FRAME_ID_SCHEMA.optional().describe('Default: the first frame.'),
    rules: z.array(rule).min(1).optional().describe('Default: all rules.'),
    limit: z.number().int().min(1).max(2000).default(500).describe('The most findings to return. total says how many exist.'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    spriteId: SPRITE_ID_SCHEMA,
    frameId: FRAME_ID_SCHEMA,
    total: COUNT_SCHEMA,
    findings: z.array(finding),
  }),
});

export { lintPixelsTool };
