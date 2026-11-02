/* @layer renderer-app @kind logic */
import type { AssetKey, AssetKind } from '@bxel/document';
import type { ScreenParams } from '@drizztdourden08/brock-react';
import { KEY_PREFIX, PIN_ON, SUBJECT_PARAM } from './properties-subject.constants';
import type { SubjectRef } from './properties-subject.type';

const encodeSubject = (ref: SubjectRef): string | undefined => {
  if (ref.path !== null) return ref.path;
  return ref.key === null ? undefined : `${KEY_PREFIX}${ref.key.kind}:${ref.key.id}`;
};

const decodeKey = (text: string): AssetKey | null => {
  const split = text.indexOf(':');
  if (split <= 0 || split === text.length - 1) return null;
  return { kind: text.slice(0, split) as AssetKind, id: text.slice(split + 1) };
};

const decodeSubject = (text: string): SubjectRef =>
  (text.startsWith(KEY_PREFIX) ? { path: null, key: decodeKey(text.slice(KEY_PREFIX.length)) } : { path: text, key: null });

const refToParams = (ref: SubjectRef | null): ScreenParams => {
  const subject = ref === null ? undefined : encodeSubject(ref);
  if (subject === undefined) return { [SUBJECT_PARAM.subject]: undefined, [SUBJECT_PARAM.pin]: undefined };
  return { [SUBJECT_PARAM.subject]: subject, [SUBJECT_PARAM.pin]: PIN_ON };
};

const paramsToRef = (params: Readonly<ScreenParams>): SubjectRef | null => {
  const subject = params[SUBJECT_PARAM.subject];
  if (params[SUBJECT_PARAM.pin] !== PIN_ON || typeof subject !== 'string' || subject === '') return null;
  return decodeSubject(subject);
};

export { paramsToRef, refToParams };
