/* @layer core @kind logic */
import { z } from 'zod';
import { LOCATION_SCHEMA } from './place.constants';
import { FILE_NAME_SCHEMA } from './shapes.constants';

const exportInput = <S extends z.ZodRawShape>(shape: S) =>
  z.xor([
    z.strictObject({ ...shape, location: LOCATION_SCHEMA.describe('A project path granted editing.') }),
    z.strictObject({ ...shape, fileName: FILE_NAME_SCHEMA.describe('Lands in the assistant folder.') }),
  ]);

export { exportInput };
