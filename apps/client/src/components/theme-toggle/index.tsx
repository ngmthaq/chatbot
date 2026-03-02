import { Brightness4, Brightness7 } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { themeAtom } from '../../stores/theme-store';

export default function ThemeToggle() {
  const { t } = useTranslation('common');
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Tooltip title={t('theme.toggle')}>
      <IconButton onClick={toggleTheme} color="inherit">
        {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
