/* @layer core @kind constants */
import { z } from 'zod';
import { GRANT_SCHEMA } from '../grants/grant-schema.constants';
import { withFailure } from '../schema/with-failure';
import { SESSION_MODE_SCHEMA } from '../tools/tool-enums.constants';
import { SESSION_TOKEN_PATTERN } from './bridge.constants';

const TOKEN_SCHEMA = z.string().regex(SESSION_TOKEN_PATTERN);

const HELLO_SCHEMA = z.strictObject({
  contract: z.number().int(),
  helperVersion: z.string().max(64),
  client: z.strictObject({
    name: z.string().max(200).nullable(),
    version: z.string().max(64).nullable(),
  }),
  launchToken: z.string().regex(SESSION_TOKEN_PATTERN).optional(),
});

const HELLO_REPLY_SCHEMA = withFailure({
  token: TOKEN_SCHEMA,
  sessionId: z.string(),
  mode: SESSION_MODE_SCHEMA,
  grant: GRANT_SCHEMA,
  trust: z.enum(['prompted', 'this_launch', 'remembered', 'allow_all']),
});

const BYE_SCHEMA = z.strictObject({ token: TOKEN_SCHEMA });

const PAIR_INFO_SCHEMA = z.strictObject({
  displayName: z.string(),
  version: z.string().nullable(),
  key: z.string().nullable(),
  remember: z.enum(['none', 'launch', 'saved']),
  headless: z.boolean(),
});

const PAIR_ANSWER_SCHEMA = z.strictObject({
  decision: z.enum(['read', 'edit', 'full', 'deny']),
  remember: z.boolean(),
});

export { BYE_SCHEMA, HELLO_REPLY_SCHEMA, HELLO_SCHEMA, PAIR_ANSWER_SCHEMA, PAIR_INFO_SCHEMA, TOKEN_SCHEMA };
