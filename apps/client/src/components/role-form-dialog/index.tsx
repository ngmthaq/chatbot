import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useRoleForm } from '../../forms/useRoleForm';
import type { CreateRoleDto, UpdateRoleDto } from '../../types/admin-types';

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleDto | UpdateRoleDto) => void;
  initialData?: UpdateRoleDto;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export default function RoleFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  mode,
}: RoleFormDialogProps) {
  const { t } = useTranslation(['admin', 'forms']);

  const formik = useRoleForm((values) => {
    onSubmit(values);
  }, initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create'
          ? t('admin:roles.addRole')
          : t('admin:roles.editRole')}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <TextField
            fullWidth
            id="name"
            name="name"
            label={t('admin:roles.name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            id="description"
            name="description"
            label={t('admin:roles.description')}
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
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
