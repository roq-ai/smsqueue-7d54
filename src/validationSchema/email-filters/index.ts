import * as yup from 'yup';

export const emailFilterValidationSchema = yup.object().shape({
  sender: yup.string(),
  subject: yup.string(),
  user_id: yup.string().nullable(),
});
