import * as yup from 'yup';

export const emailAccountValidationSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
  user_id: yup.string().nullable(),
});
