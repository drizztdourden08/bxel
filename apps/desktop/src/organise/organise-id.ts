/* @layer renderer-app @kind logic */
import { ID_BODY_LENGTH } from './organise.constants';

const organiseId = (prefix: 'col' | 'smart'): string => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, ID_BODY_LENGTH)}`;

export { organiseId };
