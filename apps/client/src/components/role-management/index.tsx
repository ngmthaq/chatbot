import { Add, Edit, Delete } from '@mui/icons-material';
import { AdminPanelSettings } from '@mui/icons-material';
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
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Role } from '../../types/auth-types';
import { formatDate } from '../../utils/formatters';
import ConfirmDialog from '../confirm-dialog';
import EmptyState from '../empty-state';
import LoadingSpinner from '../loading-spinner';
import PageHeader from '../page-header';
import SearchBar from '../search-bar';

interface RoleManagementProps {
  roles: Role[];
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: number) => void;
  isLoading?: boolean;
}

export default function RoleManagement({
  roles,
  onCreateRole,
  onEditRole,
  onDeleteRole,
  isLoading = false,
}: RoleManagementProps) {
  const { t } = useTranslation('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const canDeleteRole = (role: Role): boolean => !role.isDefault;

  const canEditRole = (role: Role): boolean => !role.isDefault;

  const getActionTooltip = (role: Role): string => {
    if (role.isDefault) {
      return t('roles.cannotModifyDefault');
    }
    return '';
  };

  const handleDeleteClick = (roleId: number) => {
    setSelectedRoleId(roleId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRoleId) {
      onDeleteRole(selectedRoleId);
    }
    setDeleteConfirmOpen(false);
    setSelectedRoleId(null);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message={t('roles.loading')} />;
  }

  return (
    <Box>
      <PageHeader
        title={t('roles.title')}
        subtitle={t('roles.subtitle')}
        actions={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateRole}
          >
            {t('roles.addRole')}
          </Button>
        }
      />

      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('roles.search')}
        />
      </Box>

      {filteredRoles.length === 0 && searchQuery === '' ? (
        <EmptyState
          icon={<AdminPanelSettings />}
          title={t('roles.noRoles')}
          description={t('roles.createFirst')}
          action={{
            label: t('roles.addRole'),
            onClick: onCreateRole,
            icon: <Add />,
          }}
        />
      ) : filteredRoles.length === 0 ? (
        <EmptyState
          icon={<AdminPanelSettings />}
          title={t('roles.noResults')}
          description={t('roles.tryDifferentSearch')}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('roles.name')}</TableCell>
                <TableCell>{t('roles.description')}</TableCell>
                <TableCell>{t('roles.isDefault')}</TableCell>
                <TableCell>{t('roles.createdAt')}</TableCell>
                <TableCell align="right">{t('roles.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description || '-'}</TableCell>
                  <TableCell>
                    {role.isDefault ? t('roles.yes') : t('roles.no')}
                  </TableCell>
                  <TableCell>{formatDate(role.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title={
                        canEditRole(role)
                          ? t('roles.edit')
                          : getActionTooltip(role)
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => onEditRole(role)}
                          disabled={!canEditRole(role)}
                        >
                          <Edit />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={
                        canDeleteRole(role)
                          ? t('roles.delete')
                          : getActionTooltip(role)
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(role.id)}
                          disabled={!canDeleteRole(role)}
                        >
                          <Delete />
                        </IconButton>
                      </span>
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
        title={t('roles.deleteConfirm')}
        message={t('roles.deleteMessage')}
        confirmColor="error"
      />
    </Box>
  );
}
