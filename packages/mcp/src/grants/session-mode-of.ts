/* @layer core @kind logic */
import type { SessionMode } from '../trust/trust.type';
import type { Grant } from './grant.type';
import { modeOfGrant } from './mode-of-grant';

const sessionModeOf = (grant: Grant): SessionMode => (modeOfGrant(grant) === 'edit' ? 'edit' : 'read');

export { sessionModeOf };
