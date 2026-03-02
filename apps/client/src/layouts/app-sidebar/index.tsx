import { Chat, Article, AdminPanelSettings } from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/useAuth';
import { Module, Action } from '../../types/admin-types';

const DRAWER_WIDTH = 240;

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { checkPermission } = useAuth();

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  const canAccessAdmin = checkPermission({
    module: Module.USERS,
    action: Action.READ,
  });

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemButton
            selected={location.pathname === '/chat'}
            onClick={() => handleNavigate('/chat')}
          >
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText primary={t('navigation.chat')} />
          </ListItemButton>

          <ListItemButton
            selected={location.pathname === '/documents'}
            onClick={() => handleNavigate('/documents')}
          >
            <ListItemIcon>
              <Article />
            </ListItemIcon>
            <ListItemText primary={t('navigation.documents')} />
          </ListItemButton>

          {canAccessAdmin && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItemButton
                selected={location.pathname === '/admin'}
                onClick={() => handleNavigate('/admin')}
              >
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={t('navigation.admin')} />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
