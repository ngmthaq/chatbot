export const APP_CONFIG = {
  // Application Info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'RAG Chat',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000',

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // File Upload
  FILE_MAX_SIZE: Number(import.meta.env.VITE_FILE_MAX_SIZE) || 52428800, // 50MB
  ACCEPTED_FILE_TYPES: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'text/plain': ['.txt'],
  },

  // SSE Configuration
  SSE_TIMEOUT: Number(import.meta.env.VITE_SSE_TIMEOUT) || 300000, // 5 minutes
  SSE_RETRY_DELAY: 3000,

  // Voice Configuration
  VOICE_CONFIG: {
    STT_LANGUAGE: import.meta.env.VITE_STT_LANGUAGE || 'en-US',
    TTS_AUTO_PLAY: import.meta.env.VITE_TTS_AUTO_PLAY === 'true',
    TTS_RATE: 1.0,
    TTS_PITCH: 1.0,
    TTS_VOLUME: 1.0,
  },

  // Chat Configuration
  DEFAULT_MODEL: 'llama3',
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 2048,
  DEFAULT_CONTEXT_WINDOW: 20,

  // Debounce/Throttle
  SEARCH_DEBOUNCE_MS: 500,
  AUTO_SAVE_DEBOUNCE_MS: 1000,

  // UI
  SIDEBAR_WIDTH: 300,
  CITATION_PANEL_WIDTH: 320,
  MESSAGE_MAX_WIDTH: 800,

  // Refresh Intervals
  DOCUMENT_PROCESSING_POLL_INTERVAL: 5000,
  ANALYTICS_REFRESH_INTERVAL: 30000,

  // Local Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'chatbot_access_token',
    REFRESH_TOKEN: 'chatbot_refresh_token',
    THEME: 'chatbot_theme',
    USER: 'chatbot_user',
    PERMISSIONS: 'chatbot_permissions',
    TTS_ENABLED: 'chatbot_tts_enabled',
    SELECTED_VOICE: 'chatbot_selected_voice',
    STT_LANGUAGE: 'chatbot_stt_language',
  },
} as const;

export const AVAILABLE_MODELS = [
  { value: 'llama3', label: 'Llama 3' },
  { value: 'llama3.1', label: 'Llama 3.1' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'codellama', label: 'Code Llama' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM D, YYYY',
  DISPLAY_WITH_TIME: 'MMM D, YYYY h:mm A',
  INPUT: 'YYYY-MM-DD',
  ISO: 'YYYY-MM-DDTHH:mm:ss',
} as const;
