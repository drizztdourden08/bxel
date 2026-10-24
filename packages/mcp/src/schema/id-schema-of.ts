/* @layer core @kind logic */
import { ID_BODY_PATTERN } from '@bxel/document';
import { z } from 'zod';

const idSchemaOf = (prefix: string) => z.string().regex(new RegExp(`^${prefix}_${ID_BODY_PATTERN}$`));

export { idSchemaOf };
