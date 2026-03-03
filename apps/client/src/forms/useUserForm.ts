import { useFormik } from 'formik';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { CreateUserDto, UpdateUserDto } from '../types/admin-types';

export const createUserFormSchema = (t: TFunction, isEdit: boolean = false) => {
  const schema: Record<string, Yup.AnySchema> = {
    email: Yup.string()
      .required(t('forms:user.errors.emailRequired'))
      .email(t('forms:user.errors.emailInvalid')),
    name: Yup.string().optional(),
    roleId: Yup.number().required(t('forms:user.errors.roleRequired')),
    phone: Yup.string().optional(),
    address: Yup.string().optional(),
    gender: Yup.string().optional().oneOf(['', 'MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: Yup.string().optional(),
  };

  if (!isEdit) {
    schema.password = Yup.string()
      .required(t('forms:user.errors.passwordRequired'))
      .min(6, t('forms:user.errors.passwordMin', { min: 6 }));
  } else {
    schema.password = Yup.string()
      .optional()
      .min(6, t('forms:user.errors.passwordMin', { min: 6 }));
  }

  return Yup.object().shape(schema);
};

export type UserFormSchema =
  | CreateUserDto
  | (Omit<UpdateUserDto, 'id'> & { id?: number });

export function useUserForm(
  initialValues: UserFormSchema,
  onSubmitCallback: (values: UserFormSchema) => void | Promise<void>,
  isEdit: boolean = false,
) {
  const { t } = useTranslation();
  const schema = createUserFormSchema(t, isEdit);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmitCallback(values);
    },
  });
}
