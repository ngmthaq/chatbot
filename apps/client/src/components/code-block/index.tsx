import { ContentCopy } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { showSuccessToast } from '../../utils/error-handler';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const { t } = useTranslation('chat');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    showSuccessToast(t('message.copied'));
  };

  return (
    <Box sx={{ position: 'relative', my: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#1e1e1e',
          px: 2,
          py: 1,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: '#d4d4d4' }}>
          {language}
        </Typography>
        <Tooltip title={t('message.copy')}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{ color: '#d4d4d4' }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}
