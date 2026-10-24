/* @layer renderer-app @kind hook */
import { answer, channelApi, hostApi, useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { answerFlush } from '../assistant/answer-flush';
import { answerPair } from '../assistant/answer-pair';
import { answerTool } from '../assistant/answer-tool';
import { APP_CHANNELS, ASK_CHANNELS } from '../ipc/contract.constants';
import type { AppSettings } from '../settings.type';
import { useAssistantStore } from '../stores/useAssistantStore';

const listen = (): (() => void) => {
  const api = channelApi(APP_CHANNELS);
  const { setSessions } = useAssistantStore.getState();
  const stops = [
    answer(ASK_CHANNELS.assistantPair, answerPair),
    answer(ASK_CHANNELS.assistantTool, answerTool),
    answer(ASK_CHANNELS.assistantFlush, answerFlush),
    api.assistantSessionsChanged((sessions) => setSessions(sessions)),
  ];
  void api.assistantSessions().then(setSessions);
  return () => {
    for (const stop of stops) stop();
  };
};

const useAssistantHost = (): void => {
  const { settings, patch, hydrated } = useSettings<AppSettings>();
  const latest = useRef(settings);
  const { assistantAccess: access, assistantStart: start, assistantFolder: folder } = settings;
  useEffect(() => {
    if (hydrated && hostApi() !== null) void channelApi(APP_CHANNELS).assistantSetup({ access, start, folder });
  }, [hydrated, access, start, folder]);
  useEffect(() => {
    latest.current = settings;
  }, [settings]);
  useEffect(() => {
    useAssistantStore.getState().setPort({ read: () => latest.current, patch });
    return () => useAssistantStore.getState().setPort(null);
  }, [patch]);
  useEffect(() => (hostApi() === null ? undefined : listen()), []);
};

export { useAssistantHost };
