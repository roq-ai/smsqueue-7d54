import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PhoneNumberInterface {
  id?: string;
  phone_number: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PhoneNumberGetQueryInterface extends GetQueryInterface {
  id?: string;
  phone_number?: string;
  user_id?: string;
}
