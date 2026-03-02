import { Box, Toolbar } from '@mui/material';
import { useAtom } from 'jotai';
import { type ReactNode, useState } from 'react';

import VoiceSettings from '../../components/voice-settings';
import { isVoiceSettingsOpenAtom } from '../../stores/conversation-store';
import AppHeader from '../app-header';
import AppSidebar from '../app-sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useAtom(
    isVoiceSettingsOpenAtom,
  );

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppHeader onMenuClick={handleSidebarToggle} />
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <VoiceSettings
        open={voiceSettingsOpen}
        onClose={() => setVoiceSettingsOpen(false)}
      />
    </Box>
  );
}
