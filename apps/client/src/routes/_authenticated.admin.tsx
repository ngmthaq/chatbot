import { Box, Container, Tabs, Tab } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageHeader from '../components/page-header';
import ProtectedRoute from '../components/protected-route';
import RoleFormDialog from '../components/role-form-dialog';
import RoleManagement from '../components/role-management';
import UserFormDialog from '../components/user-form-dialog';
import UserManagement from '../components/user-management';
import { useCreateRole } from '../mutations/useCreateRole';
import { useCreateUser } from '../mutations/useCreateUser';
import { useDeleteRole } from '../mutations/useDeleteRole';
import { useDeleteUser } from '../mutations/useDeleteUser';
import { useUpdateRole } from '../mutations/useUpdateRole';
import { useUpdateUser } from '../mutations/useUpdateUser';
import { useGetAdminUsers } from '../queries/useGetAdminUsers';
import { useGetRoles } from '../queries/useGetRoles';
import { Module, Action } from '../types/admin-types';
import {
  UserWithRole,
  CreateUserDto,
  UpdateUserDto,
  CreateRoleDto,
  UpdateRoleDto,
} from '../types/admin-types';
import { Role } from '../types/auth-types';

export const Route = createFileRoute('/_authenticated/admin')({
  component: Admin,
});

function Admin() {
  const { t } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState(0);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data: usersData, isLoading: usersLoading } = useGetAdminUsers({
    page: 1,
    limit: 100,
  });

  const { data: rolesData, isLoading: rolesLoading } = useGetRoles();

  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const { mutate: createRole, isPending: isCreatingRole } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateRole();
  const { mutate: deleteRole } = useDeleteRole();

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: UserWithRole) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleUserSubmit = (data: CreateUserDto | UpdateUserDto) => {
    if (editingUser) {
      updateUser(
        { id: editingUser.id, data },
        {
          onSuccess: () => {
            setUserDialogOpen(false);
            setEditingUser(null);
          },
        },
      );
    } else {
      createUser(data as CreateUserDto, {
        onSuccess: () => {
          setUserDialogOpen(false);
        },
      });
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  };

  const handleRoleSubmit = (data: CreateRoleDto | UpdateRoleDto) => {
    if (editingRole) {
      updateRole(
        { id: editingRole.id, data },
        {
          onSuccess: () => {
            setRoleDialogOpen(false);
            setEditingRole(null);
          },
        },
      );
    } else {
      createRole(data as CreateRoleDto, {
        onSuccess: () => {
          setRoleDialogOpen(false);
        },
      });
    }
  };

  return (
    <ProtectedRoute
      requiredPermissions={[{ module: Module.USERS, action: Action.READ }]}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PageHeader title={t('title')} subtitle={t('subtitle')} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab label={t('tabs.users')} />
            <Tab label={t('tabs.roles')} />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <>
            <UserManagement
              users={usersData?.data || []}
              onCreateUser={handleCreateUser}
              onEditUser={handleEditUser}
              onDeleteUser={deleteUser}
              isLoading={usersLoading}
            />

            <UserFormDialog
              open={userDialogOpen}
              onClose={() => {
                setUserDialogOpen(false);
                setEditingUser(null);
              }}
              onSubmit={handleUserSubmit}
              roles={rolesData || []}
              initialData={
                editingUser
                  ? {
                      email: editingUser.email,
                      name: editingUser.name || '',
                      roleId: editingUser.roleId,
                      phone: editingUser.phone || '',
                      address: editingUser.address || '',
                      gender: editingUser.gender || '',
                      dateOfBirth: editingUser.dateOfBirth || '',
                    }
                  : undefined
              }
              isLoading={isCreatingUser || isUpdatingUser}
              mode={editingUser ? 'edit' : 'create'}
            />
          </>
        )}

        {activeTab === 1 && (
          <>
            <RoleManagement
              roles={rolesData || []}
              onCreateRole={handleCreateRole}
              onEditRole={handleEditRole}
              onDeleteRole={deleteRole}
              isLoading={rolesLoading}
            />

            <RoleFormDialog
              open={roleDialogOpen}
              onClose={() => {
                setRoleDialogOpen(false);
                setEditingRole(null);
              }}
              onSubmit={handleRoleSubmit}
              initialData={
                editingRole
                  ? {
                      name: editingRole.name,
                      description: editingRole.description || '',
                    }
                  : undefined
              }
              isLoading={isCreatingRole || isUpdatingRole}
              mode={editingRole ? 'edit' : 'create'}
            />
          </>
        )}
      </Container>
    </ProtectedRoute>
  );
}
