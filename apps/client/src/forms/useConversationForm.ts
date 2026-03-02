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
    model: Yup.string().required(t('forms:conversation.errors.modelRequired')),
    temperature: Yup.number()
      .required()
      .min(0, t('forms:conversation.errors.temperatureMin', { min: 0 }))
      .max(1, t('forms:conversation.errors.temperatureMax', { max: 1 })),
    maxTokens: Yup.number()
      .required()
      .min(100, t('forms:conversation.errors.maxTokensMin', { min: 100 }))
      .max(8000, t('forms:conversation.errors.maxTokensMax', { max: 8000 })),
    contextWindow: Yup.number()
      .required()
      .min(1, t('forms:conversation.errors.contextWindowMin', { min: 1 }))
      .max(50, t('forms:conversation.errors.contextWindowMax', { max: 50 })),
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
