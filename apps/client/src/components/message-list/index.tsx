import { ChatBubbleOutline } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { Message } from '../../types/chat-types';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      <div ref={messagesEndRef} />
    </Box>
  );
}
