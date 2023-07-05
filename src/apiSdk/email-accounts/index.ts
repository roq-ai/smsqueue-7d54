import axios from 'axios';
import queryString from 'query-string';
import { EmailAccountInterface, EmailAccountGetQueryInterface } from 'interfaces/email-account';
import { GetQueryInterface } from '../../interfaces';

export const getEmailAccounts = async (query?: EmailAccountGetQueryInterface) => {
  const response = await axios.get(`/api/email-accounts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmailAccount = async (emailAccount: EmailAccountInterface) => {
  const response = await axios.post('/api/email-accounts', emailAccount);
  return response.data;
};

export const updateEmailAccountById = async (id: string, emailAccount: EmailAccountInterface) => {
  const response = await axios.put(`/api/email-accounts/${id}`, emailAccount);
  return response.data;
};

export const getEmailAccountById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/email-accounts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmailAccountById = async (id: string) => {
  const response = await axios.delete(`/api/email-accounts/${id}`);
  return response.data;
};
