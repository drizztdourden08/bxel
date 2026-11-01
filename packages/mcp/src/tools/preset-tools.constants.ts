/* @layer core @kind constants */
import { z } from 'zod';

const PRESET_ID = z.string().min(1).max(200).describe('A preset id from list_presets, such as builtin.pencil-2.');

const PRESET_NAME = z.string().min(1).max(60);

export { PRESET_ID, PRESET_NAME };
