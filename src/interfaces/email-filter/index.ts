import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmailFilterInterface {
  id?: string;
  sender?: string;
  subject?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface EmailFilterGetQueryInterface extends GetQueryInterface {
  id?: string;
  sender?: string;
  subject?: string;
  user_id?: string;
}
