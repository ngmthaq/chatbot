/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_SSE_TIMEOUT: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_VOICE_ENABLED: string;
  readonly VITE_STT_LANGUAGE: string;
  readonly VITE_TTS_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
