import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createEmailAccount } from 'apiSdk/email-accounts';
import { Error } from 'components/error';
import { emailAccountValidationSchema } from 'validationSchema/email-accounts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { EmailAccountInterface } from 'interfaces/email-account';

function EmailAccountCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EmailAccountInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEmailAccount(values);
      resetForm();
      router.push('/email-accounts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EmailAccountInterface>({
    initialValues: {
      email: '',
      password: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: emailAccountValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Email Account
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="email" mb="4" isInvalid={!!formik.errors?.email}>
            <FormLabel>Email</FormLabel>
            <Input type="text" name="email" value={formik.values?.email} onChange={formik.handleChange} />
            {formik.errors.email && <FormErrorMessage>{formik.errors?.email}</FormErrorMessage>}
          </FormControl>
          <FormControl id="password" mb="4" isInvalid={!!formik.errors?.password}>
            <FormLabel>Password</FormLabel>
            <Input type="text" name="password" value={formik.values?.password} onChange={formik.handleChange} />
            {formik.errors.password && <FormErrorMessage>{formik.errors?.password}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'email_account',
    operation: AccessOperationEnum.CREATE,
  }),
)(EmailAccountCreatePage);
