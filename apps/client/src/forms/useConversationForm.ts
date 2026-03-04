import { useFormik } from 'formik';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { ConversationSettings } from '../types/chat-types';

export const createConversationFormSchema = (t: TFunction) => {
  return Yup.object().shape({
    title: Yup.string()
      .optional()
      .max(100, t('forms:conversation.errors.titleMax', { max: 100 })),
  });
};

export type ConversationFormSchema = Yup.InferType<
  ReturnType<typeof createConversationFormSchema>
>;

export function useConversationForm(
  initialValues: ConversationFormSchema,
  onSubmitCallback: (values: ConversationSettings) => void | Promise<void>,
) {
  const { t } = useTranslation();
  const schema = createConversationFormSchema(t);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmitCallback(values);
    },
  });
}
