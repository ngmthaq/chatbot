import { useFormik } from 'formik';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { LoginDto } from '../types/auth-types';

export const createLoginFormSchema = (t: TFunction) => {
  return Yup.object().shape({
    email: Yup.string()
      .required(t('forms:login.errors.emailRequired'))
      .email(t('forms:login.errors.emailInvalid')),
    password: Yup.string()
      .required(t('forms:login.errors.passwordRequired'))
      .min(6, t('forms:login.errors.passwordMin', { min: 6 })),
  });
};

export type LoginFormSchema = Yup.InferType<
  ReturnType<typeof createLoginFormSchema>
>;

export function useLoginForm(
  initialValues: LoginFormSchema,
  onSubmitCallback: (values: LoginDto) => void | Promise<void>,
) {
  const { t } = useTranslation();
  const schema = createLoginFormSchema(t);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmitCallback(values);
    },
  });
}
