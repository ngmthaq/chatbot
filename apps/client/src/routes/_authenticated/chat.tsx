import { Box, Container, Typography } from '@mui/material';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChatInput from '../../components/chat-input';
import CitationPanel from '../../components/citation-panel';
import ConversationList from '../../components/conversation-list';
import LoadingSpinner from '../../components/loading-spinner';
import MessageList from '../../components/message-list';
import { useSSEChat } from '../../hooks/useSSEChat';
import { useCreateConversation } from '../../mutations/useCreateConversation';
import { useDeleteConversation } from '../../mutations/useDeleteConversation';
import { useGetConversation } from '../../queries/useGetConversation';
import { useGetConversations } from '../../queries/useGetConversations';
import {
  selectedConversationIdAtom,
  selectedMessageForCitationAtom,
  isCitationPanelOpenAtom,
} from '../../stores/conversation-store';

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
});

const DRAWER_WIDTH = 320;

function Chat() {
  const { t } = useTranslation('chat');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [conversationDrawerOpen, setConversationDrawerOpen] =
    useState(!isMobile);

  const [selectedConversationId, setSelectedConversationId] = useAtom(
    selectedConversationIdAtom,
  );
  const setSelectedMessageForCitation = useSetAtom(
    selectedMessageForCitationAtom,
  );
  const setIsCitationPanelOpen = useSetAtom(isCitationPanelOpenAtom);

  const { sendMessage, stopGeneration } = useSSEChat();

  const { data: conversationsData, isLoading: conversationsLoading } =
    useGetConversations({ page: 1, limit: 50 });

  const { data: currentConversation, isLoading: conversationLoading } =
    useGetConversation(selectedConversationId);

  const { mutate: createConversation } = useCreateConversation();
  const { mutate: deleteConversation } = useDeleteConversation();

  const handleSend = (message: string) => {
    if (selectedConversationId) {
      sendMessage(selectedConversationId, message);
    }
  };

  const handleCitationClick = (messageId: number) => {
    setSelectedMessageForCitation(messageId);
    setIsCitationPanelOpen(true);
  };

  const handleCreateConversation = () => {
    createConversation({
      title: t('conversation.newTitle'),
    });
  };

  const handleEditConversation = (_id: number) => {
    // TODO: Open conversation settings dialog
  };

  const handleDeleteConversation = (id: number) => {
    deleteConversation(id);
  };

  const conversationListComponent = (
    <ConversationList
      conversations={conversationsData?.data || []}
      selectedId={selectedConversationId}
      onSelect={(id) => {
        setSelectedConversationId(id);
        if (isMobile) {
          setConversationDrawerOpen(false);
        }
      }}
      onCreate={handleCreateConversation}
      onEdit={handleEditConversation}
      onDelete={handleDeleteConversation}
      isLoading={conversationsLoading}
    />
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Conversations sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={conversationDrawerOpen}
          onClose={() => setConversationDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              mt: '64px',
            },
          }}
        >
          {conversationListComponent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              mt: '64px',
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {conversationListComponent}
        </Drawer>
      )}

      {/* Chat area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {conversationLoading ? (
          <LoadingSpinner fullScreen />
        ) : selectedConversationId ? (
          <>
            <MessageList
              messages={currentConversation?.messages || []}
              onCitationClick={handleCitationClick}
            />
            <ChatInput onSend={handleSend} onStop={stopGeneration} />
          </>
        ) : (
          <Container maxWidth="md" sx={{ mt: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography>{t('message.selectConversation')}</Typography>
            </Box>
          </Container>
        )}
      </Box>

      {/* Citation panel */}
      <CitationPanel messages={currentConversation?.messages || []} />
    </Box>
  );
}
