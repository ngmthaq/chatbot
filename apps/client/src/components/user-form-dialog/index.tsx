import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useUserForm } from '../../forms/useUserForm';
import { CreateUserDto, UpdateUserDto } from '../../types/admin-types';
import { Role } from '../../types/auth-types';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  roles: Role[];
  initialData?: UpdateUserDto & { email: string };
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export default function UserFormDialog({
  open,
  onClose,
  onSubmit,
  roles,
  initialData,
  isLoading = false,
  mode,
}: UserFormDialogProps) {
  const { t } = useTranslation(['admin', 'forms']);

  const formik = useUserForm((values) => {
    onSubmit(values);
  }, initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create'
          ? t('admin:users.addUser')
          : t('admin:users.editUser')}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <TextField
            fullWidth
            id="email"
            name="email"
            label={t('admin:users.email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={mode === 'edit'}
          />

          <TextField
            fullWidth
            id="name"
            name="name"
            label={t('admin:users.name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            select
            id="roleId"
            name="roleId"
            label={t('admin:users.role')}
            value={formik.values.roleId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.roleId && Boolean(formik.errors.roleId)}
            helperText={formik.touched.roleId && formik.errors.roleId}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          {mode === 'create' && (
            <TextField
              fullWidth
              id="password"
              name="password"
              label={t('admin:users.password')}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          )}

          <TextField
            fullWidth
            id="phone"
            name="phone"
            label={t('admin:users.phone')}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {t('forms:actions.cancel')}
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={isLoading}
        >
          {t('forms:actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
