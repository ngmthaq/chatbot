import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/useAuth';
import {
  useUpdateProfile,
  type UpdateProfileDto,
} from '../../mutations/useUpdateProfile';
import { useGetProfile } from '../../queries/useGetProfile';
import { isProfileDialogOpenAtom } from '../../stores/auth-store';

const GENDER_OPTIONS = ['', 'MALE', 'FEMALE', 'OTHER'] as const;

function formatDateForInput(isoDate?: string): string {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
}

export default function UserProfileDialog() {
  const { t } = useTranslation(['common', 'admin']);
  const { user } = useAuth();
  const [open, setOpen] = useAtom(isProfileDialogOpenAtom);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { data: freshProfile } = useGetProfile();

  // Prefer fresh server data; fall back to the stored atom value
  const profile = freshProfile ?? user;

  const validationSchema = Yup.object({
    name: Yup.string().optional(),
    phone: Yup.string().optional(),
    address: Yup.string().optional(),
    gender: Yup.string().optional().oneOf(['', 'MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: Yup.string().optional(),
  });

  const formik = useFormik<UpdateProfileDto>({
    initialValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      address: profile?.address ?? '',
      gender: profile?.gender ?? '',
      dateOfBirth: formatDateForInput(profile?.dateOfBirth),
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const payload = Object.fromEntries(
        Object.entries(values).filter(
          ([, v]) => v !== '' && v !== undefined && v !== null,
        ),
      ) as UpdateProfileDto;

      if (payload.dateOfBirth && !payload.dateOfBirth.includes('T')) {
        payload.dateOfBirth = `${payload.dateOfBirth}T00:00:00.000Z`;
      }

      updateProfile(payload, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const avatarLetter =
    profile?.name?.charAt(0).toUpperCase() ??
    profile?.email?.charAt(0).toUpperCase() ??
    '?';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('common:profile.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Avatar + read-only info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, fontSize: 24 }}>
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {profile?.name || t('common:profile.noName')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email}
              </Typography>
              {profile?.role && (
                <Typography variant="caption" color="text.secondary">
                  {profile.role.name}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider />

          {/* Editable fields */}
          <Box
            component="form"
            id="profile-form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
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
              id="phone"
              name="phone"
              label={t('admin:users.phone')}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <TextField
              fullWidth
              id="address"
              name="address"
              label={t('admin:users.address')}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />

            <TextField
              select
              fullWidth
              id="gender"
              name="gender"
              label={t('admin:users.gender')}
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              {GENDER_OPTIONS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g === ''
                    ? t('admin:users.genderNone')
                    : g === 'MALE'
                      ? t('admin:users.genderMale')
                      : g === 'FEMALE'
                        ? t('admin:users.genderFemale')
                        : t('admin:users.genderOther')}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              id="dateOfBirth"
              name="dateOfBirth"
              label={t('admin:users.dateOfBirth')}
              type="date"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
              }
              helperText={
                formik.touched.dateOfBirth && formik.errors.dateOfBirth
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button
          type="submit"
          form="profile-form"
          variant="contained"
          disabled={isPending || !formik.dirty}
        >
          {isPending ? t('common:status.saving') : t('common:actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
