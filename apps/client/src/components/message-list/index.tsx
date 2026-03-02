import { ChatBubbleOutline } from '@mui/icons-material';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { currentStreamAtom } from '../../stores/streaming-store';
import { Message } from '../../types/chat-types';
import EmptyState from '../empty-state';
import MessageBubble from '../message-bubble';

interface MessageListProps {
  messages: Message[];
  onCitationClick?: (messageId: number) => void;
}

export default function MessageList({
  messages,
  onCitationClick,
}: MessageListProps) {
  const { t } = useTranslation('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentStream = useAtomValue(currentStreamAtom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStream]);

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleOutline />}
        title={t('message.noMessages')}
        description={t('message.startConversation')}
      />
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: 2,
        py: 3,
      }}
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onCitationClick={onCitationClick}
        />
      ))}

      {/* Streaming indicator */}
      {currentStream.status === 'streaming' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              maxWidth: '70%',
              p: 2,
              bgcolor: 'aiBubble.main',
              color: 'aiBubble.contrastText',
              borderRadius: 2,
            }}
          >
            {currentStream.content ? (
              <Typography variant="body1">{currentStream.content}</Typography>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">{t('message.thinking')}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
}
