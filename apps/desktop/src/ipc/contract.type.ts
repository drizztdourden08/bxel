/* @layer renderer-app @kind types */
import type { AskContract, EventContract, InvokeContract, SendContract } from '@drizztdourden08/brock-core/augment';
import type { AskContractOf, EventContractOf, InvokeContractOf, SendContractOf } from '@drizztdourden08/brock-core/ipc';
import type { APP_CHANNELS, ASK_CHANNELS } from './contract.constants';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract extends InvokeContractOf<typeof APP_CHANNELS> {}
  interface SendContract extends SendContractOf<typeof APP_CHANNELS> {}
  interface EventContract extends EventContractOf<typeof APP_CHANNELS> {}
  interface AskContract extends AskContractOf<typeof ASK_CHANNELS> {}
}

export type { AskContract, EventContract, InvokeContract, SendContract };
