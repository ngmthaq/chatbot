import { CloudUpload } from '@mui/icons-material';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { APP_CONFIG } from '../../constants/app-config';
import { formatFileSize } from '../../utils/formatters';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  progress?: number;
}

export default function DocumentUpload({
  onUpload,
  isUploading = false,
  progress = 0,
}: DocumentUploadProps) {
  const { t } = useTranslation('documents');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    multiple: false,
    disabled: isUploading,
    maxSize: APP_CONFIG.FILE_MAX_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
    },
  });

  return (
    <Paper
      {...getRootProps()}
      elevation={isDragActive ? 6 : 1}
      sx={{
        p: 4,
        textAlign: 'center',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: isUploading ? 'divider' : 'primary.main',
          bgcolor: isUploading ? 'background.paper' : 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      <CloudUpload
        sx={{
          fontSize: 64,
          color: isDragActive ? 'primary.main' : 'text.secondary',
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? t('upload.dropHere') : t('upload.dragDrop')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {t('upload.or')} <strong>{t('upload.browse')}</strong>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('upload.supportedFormats')}: PDF, DOC, DOCX, TXT
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        {t('upload.maxSize')}: {formatFileSize(APP_CONFIG.FILE_MAX_SIZE)}
      </Typography>

      {isUploading && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t('upload.uploading')}... {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Paper>
  );
}
