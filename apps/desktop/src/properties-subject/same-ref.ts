/* @layer renderer-app @kind logic */
import type { SubjectRef } from './properties-subject.type';

const sameRef = (left: SubjectRef, right: SubjectRef): boolean =>
  left.path !== null && right.path !== null
    ? left.path.toLowerCase() === right.path.toLowerCase()
    : left.key !== null && right.key !== null && left.key.kind === right.key.kind && left.key.id === right.key.id;

export { sameRef };
