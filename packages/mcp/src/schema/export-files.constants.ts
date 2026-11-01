/* @layer core @kind constants */
import { z } from 'zod';
import { COUNT_SCHEMA, SHA256_SCHEMA } from './shapes.constants';

const EXPORT_FILES_SCHEMA = z.array(z.strictObject({ fileName: z.string(), bytes: COUNT_SCHEMA, sha256: SHA256_SCHEMA }));

export { EXPORT_FILES_SCHEMA };
