import { Add, Edit, Delete } from '@mui/icons-material';
import { People } from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { UserWithRole } from '../../types/admin-types';
import { formatDate } from '../../utils/formatters';
import ConfirmDialog from '../confirm-dialog';
import EmptyState from '../empty-state';
import LoadingSpinner from '../loading-spinner';
import PageHeader from '../page-header';
import SearchBar from '../search-bar';

interface UserManagementProps {
  users: UserWithRole[];
  onCreateUser: () => void;
  onEditUser: (user: UserWithRole) => void;
  onDeleteUser: (userId: number) => void;
  isLoading?: boolean;
}

export default function UserManagement({
  users,
  onCreateUser,
  onEditUser,
  onDeleteUser,
  isLoading = false,
}: UserManagementProps) {
  const { t } = useTranslation('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId) {
      onDeleteUser(selectedUserId);
    }
    setDeleteConfirmOpen(false);
    setSelectedUserId(null);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message={t('users.loading')} />;
  }

  return (
    <Box>
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        actions={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateUser}
          >
            {t('users.addUser')}
          </Button>
        }
      />

      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('users.search')}
        />
      </Box>

      {filteredUsers.length === 0 && searchQuery === '' ? (
        <EmptyState
          icon={<People />}
          title={t('users.noUsers')}
          description={t('users.createFirst')}
          action={{
            label: t('users.addUser'),
            onClick: onCreateUser,
            icon: <Add />,
          }}
        />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<People />}
          title={t('users.noResults')}
          description={t('users.tryDifferentSearch')}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('users.name')}</TableCell>
                <TableCell>{t('users.email')}</TableCell>
                <TableCell>{t('users.role')}</TableCell>
                <TableCell>{t('users.createdAt')}</TableCell>
                <TableCell align="right">{t('users.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role?.name || t('users.noRole')}
                      size="small"
                      color={user.role?.name === 'ADMIN' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('users.edit')}>
                      <IconButton size="small" onClick={() => onEditUser(user)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('users.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('users.deleteConfirm')}
        message={t('users.deleteMessage')}
        confirmColor="error"
      />
    </Box>
  );
}
