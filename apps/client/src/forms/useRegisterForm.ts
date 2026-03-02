import { useFormik } from 'formik';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { RegisterDto } from '../types/auth-types';

export const createRegisterFormSchema = (t: TFunction) => {
  return Yup.object().shape({
    email: Yup.string()
      .required(t('forms:register.errors.emailRequired'))
      .email(t('forms:register.errors.emailInvalid')),
    name: Yup.string().optional(),
    password: Yup.string()
      .required(t('forms:register.errors.passwordRequired'))
      .min(6, t('forms:register.errors.passwordMin', { min: 6 })),
    confirmPassword: Yup.string()
      .required(t('forms:register.errors.confirmPasswordRequired'))
      .oneOf(
        [Yup.ref('password')],
        t('forms:register.errors.passwordsMustMatch'),
      ),
  });
};

export type RegisterFormSchema = Yup.InferType<
  ReturnType<typeof createRegisterFormSchema>
>;

export function useRegisterForm(
  initialValues: RegisterFormSchema,
  onSubmitCallback: (values: RegisterDto) => void | Promise<void>,
) {
  const { t } = useTranslation();
  const schema = createRegisterFormSchema(t);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmitCallback(values);
    },
  });
}
