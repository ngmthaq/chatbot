import { ContentCopy, VolumeUp } from '@mui/icons-material';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { Message } from '../../types/chat-types';
import { showSuccessToast } from '../../utils/error-handler';
import { formatDateRelative } from '../../utils/formatters';
import CodeBlock from '../code-block';

interface MessageBubbleProps {
  message: Message;
  onCitationClick?: (messageId: number) => void;
}

export default function MessageBubble({
  message,
  onCitationClick,
}: MessageBubbleProps) {
  const { t } = useTranslation('chat');
  const { speak } = useTextToSpeech();
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    showSuccessToast(t('message.copied'));
  };

  const handleSpeak = () => {
    speak(message.content);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          maxWidth: '70%',
          p: 2,
          bgcolor: isUser ? 'userBubble.main' : 'aiBubble.main',
          color: isUser ? 'userBubble.contrastText' : 'aiBubble.contrastText',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ mb: 1 }}>
          <ReactMarkdown
            components={{
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock
                    language={match[1]}
                    code={String(children).replace(/\n$/, '')}
                  />
                ) : (
                  <code
                    className={className}
                    {...props}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </Box>

        {message.citations && message.citations.length > 0 && (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {t('message.citations')}: {message.citations.length}
            </Typography>
            {onCitationClick && (
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  opacity: 0.9,
                }}
                onClick={() => onCitationClick(message.id)}
              >
                {t('message.viewCitations')}
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {formatDateRelative(message.timestamp)}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={t('message.copy')}>
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isUser && (
              <Tooltip title={t('message.speak')}>
                <IconButton size="small" onClick={handleSpeak}>
                  <VolumeUp fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
