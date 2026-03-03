import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  VolumeUp,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import { useSetAtom } from 'jotai';
import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import ThemeToggle from '../../components/theme-toggle';
import UserProfileDialog from '../../components/user-profile';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../mutations/useLogout';
import { isProfileDialogOpenAtom } from '../../stores/auth-store';
import { isVoiceSettingsOpenAtom } from '../../stores/conversation-store';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setVoiceSettingsOpen = useSetAtom(isVoiceSettingsOpenAtom);
  const setProfileOpen = useSetAtom(isProfileDialogOpenAtom);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setProfileOpen(true);
    handleMenuClose();
  };

  const handleVoiceSettings = () => {
    setVoiceSettingsOpen(true);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t('app.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ThemeToggle />

          <Tooltip title={t('menu.voiceSettings')}>
            <IconButton color="inherit" onClick={handleVoiceSettings}>
              <VolumeUp />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('menu.account')}>
            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0).toUpperCase() || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            {t('menu.profile')}
          </MenuItem>
          <MenuItem onClick={handleVoiceSettings}>
            <ListItemIcon>
              <VolumeUp fontSize="small" />
            </ListItemIcon>
            {t('menu.voiceSettings')}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            {t('menu.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>

      <UserProfileDialog />
    </AppBar>
  );
}
