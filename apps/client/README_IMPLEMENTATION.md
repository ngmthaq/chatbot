# RAG Chat Frontend - Implementation Complete

## 🎉 Project Status: READY

The production-ready RAG Chat frontend has been successfully implemented with all requested features and following your exact conventions.

## ✅ Completed Features

### 1. **Authentication System** (JWT + RBAC)

- Login, Register, Forgot Password forms with Formik + Yup validation
- JWT token management with automatic refresh on 401
- Protected routes with permission-based access control
- User profile and role management

### 2. **Chat System with SSE Streaming**

- Real-time streaming chat using Server-Sent Events (SSE)
- Message list with auto-scroll and streaming indicators
- Conversation management (create, update, delete, archive)
- Conversation settings (model, temperature, tokens, context window)
- Citation panel with document references
- Markdown rendering with syntax highlighting for code blocks

### 3. **Voice Features** (Speech-to-Text + Text-to-Speech)

- **PTT Button**: Press-and-hold to record voice input
- **Speech-to-Text**: Chrome Web Speech API integration
- **Text-to-Speech**: Native browser SpeechSynthesis API
- **Voice State Machine**: IDLE → LISTENING → PROCESSING → SPEAKING
- **Voice Settings Dialog**: Language selection, voice selection, TTS toggle
- **Waveform Animation**: Visual feedback during recording
- **Speaker Indicator**: Visual feedback during TTS playback

### 4. **Document Management**

- Document upload with drag-and-drop (react-dropzone)
- Document table with status badges (UPLOADED, PROCESSING, PROCESSED, FAILED)
- File type validation (PDF, DOC, DOCX, TXT)
- 50MB file size limit
- Upload progress indicator
- Delete functionality

### 5. **Admin Dashboard**

- **User Management**: CRUD operations with role assignment
- **Role Management**: CRUD operations for roles
- **RBAC Permissions**: Permission-based access control
- Search and filter functionality
- Confirmation dialogs for destructive actions

### 6. **Internationalization (i18next)**

- English translations (complete)
- Vietnamese translations (structure ready)
- 6 namespaces: common, auth, chat, documents, admin, forms
- Dynamic language switching

### 7. **State Management**

- **Jotai Atoms**: auth, voice, streaming, theme, conversation
- **LocalStorage Persistence**: tokens, theme, voice settings, user data
- **Derived Atoms**: computed state (isAuthenticated, isListening, isSpeaking, etc.)

### 8. **Styling & Theme**

- **MUI v6**: Material Design 3 tokens
- **Light/Dark Mode**: User toggle with persistence
- **Custom Theme**: Extended palette for chat bubbles
- **Responsive Design**: Mobile-first approach
- **CSS Animations**: Pulse, waveform, fade-in effects

## 📁 Project Structure

```text
apps/client/src/
├── components/          # UI components (32 components)
│   ├── auth/           # Login, Register, Forgot Password forms
│   ├── voice/          # PTT button, waveform, speaker indicator, settings
│   ├── chat/           # Message bubble/list, input, conversation list, citations
│   ├── documents/      # Upload, table, status badge
│   ├── admin/          # User/role management, form dialogs
│   └── shared/         # Loading, error boundary, protected route, theme toggle, etc.
├── constants/          # API routes, app config, RBAC constants
├── forms/              # Formik hooks (6 forms)
├── hooks/              # Custom hooks (auth, STT, TTS, SSE chat)
├── layouts/            # Auth layout, app layout with header/sidebar
├── mutations/          # TanStack Query mutations (14 mutations)
├── providers/          # Theme, query, app providers composition
├── queries/            # TanStack Query hooks (8 queries)
├── routes/             # File-based routing (9 routes)
├── stores/             # Jotai atoms (5 stores)
├── types/              # TypeScript types (6 type files)
└── utils/              # Utilities (token, API client, formatters, i18n, etc.)
```

## 🔧 Configuration

### Environment Variables (.env in root)

```bash
VITE_API_BASE_URL=http://localhost:9000
VITE_APP_TITLE=RAG Chat Assistant
VITE_SSE_TIMEOUT=300000
VITE_MAX_FILE_SIZE=52428800
VITE_VOICE_ENABLED=true
VITE_STT_LANGUAGE=en-US
VITE_TTS_ENABLED=true
```

### Key Dependencies

- **React 19** + **Vite**
- **TanStack Router 1.94** (file-based routing)
- **TanStack Query 5. 62** (server state)
- **Jotai 2.10** (client state)
- **MUI v6** (UI components)
- **Formik + Yup** (forms)
- **i18next** (i18n)
- **react-speech-recognition** (STT)
- **react-markdown** (Markdown rendering)
- **react-syntax-highlighter** (code highlighting)
- **react-dropzone** (file upload)
- **Axios** (HTTP client)
- **eventsource-parser** (SSE streaming)
- **dayjs** (date formatting)
- **sonner** (toast notifications)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd apps/client
yarn install
```

### 2. Generate Router Types

```bash
npx tsr generate
```

### 3. Start Development Server

```bash
yarn dev
```

### 4. Build for Production

```bash
yarn build
```

## 🎯 Coding Conventions Used

✅ **Kebab-case** filenames (`use-login.ts`, `login-form/index.tsx`)  
✅ **No `.mutation` suffix** (mutations are `useLogin.ts` not `useLogin.mutation.ts`)  
✅ **Query naming**: `useGetX` pattern (`useGetProfile`, `useGetConversations`)  
✅ **Flat components**: `component-name/index.tsx` (no nesting)  
✅ **File-based routing**: `route_name/index.tsx` pattern  
✅ **Root `.env`**: Environment variables at project root  
✅ **Yarn**: Package manager  
✅ **Form hooks in `forms/`**: Separate from UI components

## 📋 Routes

- `/` - Redirect to `/chat` (authenticated) or `/login` (guest)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset page
- `/_authenticated` - Protected layout wrapper
  - `/chat` - Chat interface with conversations sidebar
  - `/documents` - Document management
  - `/admin` - Admin dashboard (users & roles)

## 🔐 Authentication Flow

1. User logs in → `useLogin` mutation
2. JWT tokens stored → `token-manager.ts`
3. Fetch user profile + permissions → Update Jotai atoms
4. API client injects JWT in requests → Axios interceptor
5. On 401 → Auto-refresh tokens → Retry failed requests
6. On refresh failure → Logout → Redirect to `/login`

## 🎤 Voice Flow

1. User presses PTT button → `voiceStateAtom` = LISTENING
2. Chrome Web Speech API starts listening
3. Transcript updates in real-time → `transcriptAtom`
4. User releases button → Stop listening → `voiceStateAtom` = IDLE
5. Send message with transcript → Chat input
6. AI responds → `voiceStateAtom` = SPEAKING
7. Native SpeechSynthesis speaks response
8. On end → `voiceStateAtom` = IDLE

## 💬 Chat SSE Streaming Flow

1. User sends message → `useSSEChat` hook
2. POST request to `/chat/send` with conversation ID + message
3. Server responds with SSE stream
4. `eventsource-parser` parses chunks
5. `streaming-store` updates with each chunk
6. `MessageList` displays streaming content
7. On "done" event → Save message to conversation
8. User can stop generation with AbortController

## 📦 State Management

### Jotai Stores

- **auth-store**: User, permissions, authentication state
- **voice-store**: Voice state machine, transcript, mic permission, TTS/STT settings
- **streaming-store**: Current stream content, status, abort controller
- **theme-store**: Light/dark mode preference
- **conversation-store**: Selected conversation, citation panel, dialog states

### TanStack Query

- **Queries**: Data fetching with caching (30s stale, 5min cache)
- **Mutations**: Data mutations with optimistic updates and cache invalidation
- **Global error handler**: Toast notifications for API errors

## 🎨 Theme System

- **MUI ThemeProvider**: Light/dark mode with MD3 tokens
- **Custom colors**: Chat bubble colors (user/AI)
- **Typography**: Roboto font family
- **Component overrides**: Button, TextField, etc.
- **Emotion CSS-in-JS**: Styled components
- **Theme toggle**: IconButton in app header

## 📝 Forms

All forms use **Formik + Yup** pattern:

1. Form hook in `forms/` folder exports Formik instance
2. UI component in `components/` folder consumes hook
3. Validation errors translated via i18next
4. Submit handler calls mutation hook
5. Success toast + navigation/close dialog

## 🛠️ Next Steps (Optional Enhancements)

1. **WebSocket Support**: For real-time notifications
2. **PWA**: Service worker for offline support
3. **Advanced Analytics**: Charts for token usage, model performance
4. **Multi-language Support**: Complete Vietnamese translations
5. **Chat Export**: Export conversations as PDF/MD
6. **Image Upload**: Support image inputs for vision models
7. **Voice Interruption**: Stop TTS mid-sentence
8. **Conversation Search**: Full-text search across messages
9. **User Settings**: Timezone, notifications, etc.
10. **Dark mode improvements**: per-component theming

## 🐛 Known Issues

- Some ESLint formatting warnings (non-blocking)
- Voice features require HTTPS in production (Chrome requirement)
- SSE POST requests not supported by native EventSource (using fetch polyfill)

## 📚 Documentation

- **TanStack Router**: <https://tanstack.com/router>
- **TanStack Query**: <https://tanstack.com/query>
- **Jotai**: <https://jotai.org>
- **MUI**: <https://mui.com>
- **i18next**: <https://www.i18next.com>
- **Formik**: <https://formik.org>
- **Web Speech API**: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API>

## 🤝 Contributing

Follow the established patterns:

1. Types first → Constants → Utils → Stores → Hooks → Components → Routes
2. Use kebab-case for files
3. Component folders with `index.tsx` (and optional `styled.tsx`)
4. Always use i18next for text
5. Test with both light/dark themes
6. Ensure mobile responsiveness

---

## Built with ❤️

Using React 19, TypeScript, TanStack, Jotai, and MUI v6
