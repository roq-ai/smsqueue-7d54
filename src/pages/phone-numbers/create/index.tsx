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
import { createPhoneNumber } from 'apiSdk/phone-numbers';
import { Error } from 'components/error';
import { phoneNumberValidationSchema } from 'validationSchema/phone-numbers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PhoneNumberInterface } from 'interfaces/phone-number';

function PhoneNumberCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PhoneNumberInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPhoneNumber(values);
      resetForm();
      router.push('/phone-numbers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PhoneNumberInterface>({
    initialValues: {
      phone_number: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: phoneNumberValidationSchema,
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
            Create Phone Number
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="phone_number" mb="4" isInvalid={!!formik.errors?.phone_number}>
            <FormLabel>Phone Number</FormLabel>
            <Input type="text" name="phone_number" value={formik.values?.phone_number} onChange={formik.handleChange} />
            {formik.errors.phone_number && <FormErrorMessage>{formik.errors?.phone_number}</FormErrorMessage>}
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
    entity: 'phone_number',
    operation: AccessOperationEnum.CREATE,
  }),
)(PhoneNumberCreatePage);
