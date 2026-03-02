import { Delete, Download } from '@mui/icons-material';
import { Article } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Document } from '../../types/document-types';
import { formatDate, formatFileSize } from '../../utils/formatters';
import DocumentStatusBadge from '../document-status-badge';
import EmptyState from '../empty-state';

interface DocumentTableProps {
  documents: Document[];
  onDelete: (id: number) => void;
  onDownload?: (id: number) => void;
}

export default function DocumentTable({
  documents,
  onDelete,
  onDownload,
}: DocumentTableProps) {
  const { t } = useTranslation('documents');

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<Article />}
        title={t('table.noDocuments')}
        description={t('table.uploadFirst')}
      />
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('table.name')}</TableCell>
            <TableCell>{t('table.status')}</TableCell>
            <TableCell>{t('table.size')}</TableCell>
            <TableCell>{t('table.uploadDate')}</TableCell>
            <TableCell align="right">{t('table.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} hover>
              <TableCell>{doc.filename}</TableCell>
              <TableCell>
                <DocumentStatusBadge status={doc.status} />
              </TableCell>
              <TableCell>{formatFileSize(doc.size)}</TableCell>
              <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
              <TableCell align="right">
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                >
                  {onDownload && (
                    <Tooltip title={t('actions.download')}>
                      <IconButton
                        size="small"
                        onClick={() => onDownload(doc.id)}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t('actions.delete')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(doc.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
