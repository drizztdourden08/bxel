/* @layer renderer-app @kind types */
interface BankOption {
  value: string;
  label: string;
}

type BankOutcome = { ok: true; message: string } | { ok: false; message: string };

export type { BankOption, BankOutcome };
