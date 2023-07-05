import axios from 'axios';
import queryString from 'query-string';
import { EmailFilterInterface, EmailFilterGetQueryInterface } from 'interfaces/email-filter';
import { GetQueryInterface } from '../../interfaces';

export const getEmailFilters = async (query?: EmailFilterGetQueryInterface) => {
  const response = await axios.get(`/api/email-filters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmailFilter = async (emailFilter: EmailFilterInterface) => {
  const response = await axios.post('/api/email-filters', emailFilter);
  return response.data;
};

export const updateEmailFilterById = async (id: string, emailFilter: EmailFilterInterface) => {
  const response = await axios.put(`/api/email-filters/${id}`, emailFilter);
  return response.data;
};

export const getEmailFilterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/email-filters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmailFilterById = async (id: string) => {
  const response = await axios.delete(`/api/email-filters/${id}`);
  return response.data;
};
