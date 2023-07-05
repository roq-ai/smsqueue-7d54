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
import { createEmailFilter } from 'apiSdk/email-filters';
import { Error } from 'components/error';
import { emailFilterValidationSchema } from 'validationSchema/email-filters';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { EmailFilterInterface } from 'interfaces/email-filter';

function EmailFilterCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EmailFilterInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEmailFilter(values);
      resetForm();
      router.push('/email-filters');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EmailFilterInterface>({
    initialValues: {
      sender: '',
      subject: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: emailFilterValidationSchema,
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
            Create Email Filter
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="sender" mb="4" isInvalid={!!formik.errors?.sender}>
            <FormLabel>Sender</FormLabel>
            <Input type="text" name="sender" value={formik.values?.sender} onChange={formik.handleChange} />
            {formik.errors.sender && <FormErrorMessage>{formik.errors?.sender}</FormErrorMessage>}
          </FormControl>
          <FormControl id="subject" mb="4" isInvalid={!!formik.errors?.subject}>
            <FormLabel>Subject</FormLabel>
            <Input type="text" name="subject" value={formik.values?.subject} onChange={formik.handleChange} />
            {formik.errors.subject && <FormErrorMessage>{formik.errors?.subject}</FormErrorMessage>}
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
    entity: 'email_filter',
    operation: AccessOperationEnum.CREATE,
  }),
)(EmailFilterCreatePage);
