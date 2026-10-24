/* @layer core @kind constants */
import { z } from 'zod';
import { INDEXES_TEXT_MAX, PROJECT_PATH_LENGTH_MAX, RENDER_SIDE_MAX } from '../limits/limits.constants';

const LAST_COORDINATE = RENDER_SIDE_MAX - 1;

const RECT_SCHEMA = z
  .strictObject({
    x: z.number().int().min(0).max(LAST_COORDINATE),
    y: z.number().int().min(0).max(LAST_COORDINATE),
    width: z.number().int().min(1).max(RENDER_SIDE_MAX),
    height: z.number().int().min(1).max(RENDER_SIDE_MAX),
  })
  .meta({ id: 'Rect' });

const INDEXES_SCHEMA = z
  .base64()
  .min(4)
  .max(INDEXES_TEXT_MAX)
  .meta({
    id: 'Indexes',
    description: 'Palette indexes, one byte per pixel, row-major, standard base64 with padding.',
  });

const FILE_NAME_SCHEMA = z
  .string()
  .regex(/^[A-Za-z0-9_][A-Za-z0-9 _.-]{0,59}\.[a-z]{3,4}$/)
  .meta({ id: 'FileName' });

const REL_PATH_SCHEMA = z
  .string()
  .max(PROJECT_PATH_LENGTH_MAX)
  .regex(/^(?:[A-Za-z0-9_][A-Za-z0-9 _.-]{0,63}\/){0,15}[A-Za-z0-9_][A-Za-z0-9 _.-]{0,63}$/)
  .meta({
    id: 'RelPath',
    description: 'Relative to one project folder. Main also checks trailing dots and spaces, reserved names and containment.',
  });

const COUNT_SCHEMA = z.number().int().min(0);
const HEX_COLOR_SCHEMA = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
const SHA256_SCHEMA = z.string().regex(/^sha256:[0-9a-f]{64}$/);
const TIMESTAMP_SCHEMA = z.string().min(1).max(64);

export {
  COUNT_SCHEMA,
  FILE_NAME_SCHEMA,
  HEX_COLOR_SCHEMA,
  INDEXES_SCHEMA,
  RECT_SCHEMA,
  REL_PATH_SCHEMA,
  SHA256_SCHEMA,
  TIMESTAMP_SCHEMA,
};
