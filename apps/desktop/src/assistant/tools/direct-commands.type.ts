/* @layer renderer-app @kind types */
type Args = Readonly<Record<string, unknown>>;

type Direct = (args: Args) => string | null;

export type { Args, Direct };
