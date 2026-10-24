/* @layer renderer-app @kind hook */
import { channelApi, hostApi } from '@drizztdourden08/brock-react';
import { useEffect, useState } from 'react';
import { APP_CHANNELS } from '../../../ipc/contract.constants';

const useClientConfig = (): string | null => {
  const [config, setConfig] = useState<string | null>(null);
  useEffect(() => {
    if (hostApi() === null) return;
    void channelApi(APP_CHANNELS)
      .assistantClientConfig()
      .then((launch) => setConfig(JSON.stringify({ mcpServers: { bxel: { type: 'stdio', ...launch } } }, null, 2)));
  }, []);
  return config;
};

export { useClientConfig };
