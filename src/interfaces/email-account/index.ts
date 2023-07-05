import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmailAccountInterface {
  id?: string;
  email: string;
  password: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface EmailAccountGetQueryInterface extends GetQueryInterface {
  id?: string;
  email?: string;
  password?: string;
  user_id?: string;
}
