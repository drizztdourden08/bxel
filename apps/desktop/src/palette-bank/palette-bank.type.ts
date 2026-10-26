/* @layer renderer-app @kind types */
interface BankOption {
  value: string;
  label: string;
}

type BankOutcome = { ok: true; message: string } | { ok: false; message: string };

interface RecolourChange {
  index: number;
  rgb: string;
  alpha?: number;
}

export type { BankOption, BankOutcome, RecolourChange };
