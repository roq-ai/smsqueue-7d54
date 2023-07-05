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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEmailFilterById, updateEmailFilterById } from 'apiSdk/email-filters';
import { Error } from 'components/error';
import { emailFilterValidationSchema } from 'validationSchema/email-filters';
import { EmailFilterInterface } from 'interfaces/email-filter';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function EmailFilterEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EmailFilterInterface>(
    () => (id ? `/email-filters/${id}` : null),
    () => getEmailFilterById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EmailFilterInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEmailFilterById(id, values);
      mutate(updated);
      resetForm();
      router.push('/email-filters');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EmailFilterInterface>({
    initialValues: data,
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
            Edit Email Filter
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(EmailFilterEditPage);
