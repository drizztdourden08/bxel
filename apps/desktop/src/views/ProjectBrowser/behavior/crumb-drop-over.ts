/* @layer renderer-app @kind logic */
import type { DropFeedback } from '@drizztdourden08/brock-react';

const crumbDropOver = <T,>(feedback: DropFeedback<T>, id: string) => (was: string | null): string | null => {
  if (feedback.accepted && (feedback.phase === 'enter' || feedback.phase === 'over')) return id;
  return was === id ? null : was;
};

export { crumbDropOver };
