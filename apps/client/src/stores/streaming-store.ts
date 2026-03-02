import { atom } from 'jotai';

import type { StreamState } from '../types/chat-types';

// Current stream state
export const currentStreamAtom = atom<StreamState>({
  conversationId: null,
  content: '',
  status: 'idle',
  tokenUsage: undefined,
  sourceDocuments: undefined,
  error: undefined,
});

// Derived streaming state
export const isStreamingAtom = atom((get) => {
  const stream = get(currentStreamAtom);
  return stream.status === 'streaming';
});

// Abort controller for cancelling streams
export const abortControllerAtom = atom<AbortController | null>(null);

// Stream error atom
export const streamErrorAtom = atom((get) => {
  const stream = get(currentStreamAtom);
  return stream.error || null;
});

// Stream metadata
export const streamMetadataAtom = atom((get) => {
  const stream = get(currentStreamAtom);
  return {
    tokenUsage: stream.tokenUsage,
    sourceDocuments: stream.sourceDocuments,
  };
});

// Actions to update stream
export const updateStreamContentAtom = atom(
  null,
  (get, set, content: string) => {
    const current = get(currentStreamAtom);
    set(currentStreamAtom, {
      ...current,
      content,
      status: 'streaming',
    });
  },
);

export const completeStreamAtom = atom(
  null,
  (
    get,
    set,
    metadata?: {
      tokenUsage?: number;
      sourceDocuments?: Array<{
        pageContent: string;
        metadata?: Record<string, unknown>;
      }>;
    },
  ) => {
    const current = get(currentStreamAtom);
    set(currentStreamAtom, {
      ...current,
      status: 'complete',
      tokenUsage: metadata?.tokenUsage,
      sourceDocuments: metadata?.sourceDocuments,
    });
  },
);

export const errorStreamAtom = atom(null, (get, set, error: string) => {
  const current = get(currentStreamAtom);
  set(currentStreamAtom, {
    ...current,
    status: 'error',
    error,
  });
});

export const resetStreamAtom = atom(null, (get, set) => {
  set(currentStreamAtom, {
    conversationId: null,
    content: '',
    status: 'idle',
    tokenUsage: undefined,
    sourceDocuments: undefined,
    error: undefined,
  });
  set(abortControllerAtom, null);
});

export const startStreamAtom = atom(
  null,
  (get, set, conversationId: number) => {
    set(currentStreamAtom, {
      conversationId,
      content: '',
      status: 'streaming',
      tokenUsage: undefined,
      sourceDocuments: undefined,
      error: undefined,
    });
  },
);
