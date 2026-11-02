/* @layer renderer-app @kind types */
interface GuideStroke {
  from: readonly [number, number];
  to: readonly [number, number];
  colour: string;
}

export type { GuideStroke };
