/* @layer renderer-app @kind types */
import type { StoredPrefs } from './parse-prefs.type';

type PickedPrefs = Pick<StoredPrefs, 'openOnHover' | 'holdMs' | 'springMs' | 'shareBrush'>;

export type { PickedPrefs };
