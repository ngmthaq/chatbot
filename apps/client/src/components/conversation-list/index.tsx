import {
  Add,
  MoreVert,
  ChatBubbleOutline,
  Delete,
  Edit,
} from '@mui/icons-material';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { Conversation } from '../../types/chat-types';
import { formatDateRelative } from '../../utils/formatters';
import EmptyState from '../empty-state';
import LoadingSpinner from '../loading-spinner';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: ConversationListProps) {
  const { t } = useTranslation('chat');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuConversationId, setMenuConversationId] = useState<number | null>(
    null,
  );

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuConversationId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuConversationId(null);
  };

  const handleEdit = () => {
    if (menuConversationId) {
      onEdit(menuConversationId);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuConversationId) {
      onDelete(menuConversationId);
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <LoadingSpinner message={t('conversation.loading')} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {t('conversation.title')}
        </Typography>
        <Tooltip title={t('conversation.new')}>
          <IconButton size="small" onClick={onCreate} color="primary">
            <Add />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {conversations.length === 0 ? (
          <EmptyState
            icon={<ChatBubbleOutline />}
            title={t('conversation.empty')}
            description={t('conversation.createFirst')}
            action={{
              label: t('conversation.new'),
              onClick: onCreate,
              icon: <Add />,
            }}
          />
        ) : (
          <List>
            {conversations.map((conversation) => (
              <ListItemButton
                key={conversation.id}
                selected={selectedId === conversation.id}
                onClick={() => onSelect(conversation.id)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={conversation.title}
                  secondary={formatDateRelative(conversation.updatedAt)}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontWeight: selectedId === conversation.id ? 600 : 400,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, conversation.id)}
                  sx={{ ml: 1 }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          {t('conversation.edit')}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          {t('conversation.delete')}
        </MenuItem>
      </Menu>
    </Box>
  );
}
