import { useFormik } from 'formik';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { ForgotPasswordDto } from '../types/auth-types';

export const createForgotPasswordFormSchema = (t: TFunction) => {
  return Yup.object().shape({
    email: Yup.string()
      .required(t('forms:forgotPassword.errors.emailRequired'))
      .email(t('forms:forgotPassword.errors.emailInvalid')),
  });
};

export type ForgotPasswordFormSchema = Yup.InferType<
  ReturnType<typeof createForgotPasswordFormSchema>
>;

export function useForgotPasswordForm(
  initialValues: ForgotPasswordFormSchema,
  onSubmitCallback: (values: ForgotPasswordDto) => void | Promise<void>,
) {
  const { t } = useTranslation();
  const schema = createForgotPasswordFormSchema(t);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmitCallback(values);
    },
  });
}
