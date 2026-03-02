import { useFormik } from 'formik';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { CreateRoleDto, UpdateRoleDto } from '../types/admin-types';

export const createRoleFormSchema = (t: TFunction) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('forms:role.errors.nameRequired'))
      .min(2, t('forms:role.errors.nameMin', { min: 2 }))
      .max(50, t('forms:role.errors.nameMax', { max: 50 })),
    description: Yup.string().optional(),
  });
};

export type RoleFormSchema = CreateRoleDto | (UpdateRoleDto & { id?: number });

export function useRoleForm(
  initialValues: RoleFormSchema,
  onSubmitCallback: (values: RoleFormSchema) => void | Promise<void>,
) {
  const { t } = useTranslation();
  const schema = createRoleFormSchema(t);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmitCallback(values);
    },
  });
}
