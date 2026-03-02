import { Close, Article } from '@mui/icons-material';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import {
  selectedMessageForCitationAtom,
  isCitationPanelOpenAtom,
} from '../../stores/conversation-store';
import type { Message } from '../../types/chat-types';

interface CitationPanelProps {
  messages: Message[];
}

export default function CitationPanel({ messages }: CitationPanelProps) {
  const { t } = useTranslation('chat');
  const selectedMessageId = useAtomValue(selectedMessageForCitationAtom);
  const setIsOpen = useSetAtom(isCitationPanelOpenAtom);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);
  const citations = selectedMessage?.citations || [];

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedMessageId)}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {t('citation.title')}
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        {citations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('citation.noCitations')}
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('citation.count', { count: citations.length })}
            </Typography>

            <List>
              {citations.map((citation, index) => (
                <Box key={index}>
                  <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                    <Article sx={{ mr: 2, mt: 0.5, color: 'primary.main' }} />
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            {citation.documentTitle}
                          </Typography>
                          <Chip
                            label={
                              citation.pageNumber
                                ? t('citations.page', { number: citation.pageNumber })
                                : t('citations.pageNA')
                            }
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {citation.snippet}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < citations.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
}
