/* @layer renderer-app @kind logic */
const queue: { tail: Promise<unknown> } = { tail: Promise.resolve() };

const queuedSave = <T>(job: () => Promise<T>): Promise<T> => {
  const run = queue.tail.then(job, job);
  queue.tail = run.catch(() => undefined);
  return run;
};

export { queuedSave };
