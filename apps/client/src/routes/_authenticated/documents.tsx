import { Box, Container } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DocumentTable from '../../components/document-table';
import DocumentUpload from '../../components/document-upload';
import LoadingSpinner from '../../components/loading-spinner';
import PageHeader from '../../components/page-header';
import { useDeleteDocument } from '../../mutations/useDeleteDocument';
import { useUploadDocument } from '../../mutations/useUploadDocument';
import { useGetDocuments } from '../../queries/useGetDocuments';

export const Route = createFileRoute('/_authenticated/documents')({
  component: Documents,
});

function Documents() {
  const { t } = useTranslation('documents');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: documentsData, isLoading } = useGetDocuments({
    page: 1,
    limit: 50,
  });

  const { mutate: uploadDocument, isPending: isUploading } =
    useUploadDocument();

  const { mutate: deleteDocument } = useDeleteDocument();

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    uploadDocument(formData, {
      onSuccess: () => {
        setUploadProgress(0);
      },
      onError: () => {
        setUploadProgress(0);
      },
    });

    // Simulate progress for demo
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleDelete = (id: number) => {
    deleteDocument(id);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner fullScreen message={t('loading')} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Box sx={{ mb: 4 }}>
        <DocumentUpload
          onUpload={handleUpload}
          isUploading={isUploading}
          progress={uploadProgress}
        />
      </Box>

      <DocumentTable
        documents={documentsData?.data || []}
        onDelete={handleDelete}
      />
    </Container>
  );
}
