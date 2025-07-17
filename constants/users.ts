import { User } from '@/types';

export const HARDCODED_USERS: User[] = [
  {
    id: '1',
    name: 'Ethan Carter',
    email: 'ethan.carter@email.com',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@email.com',
  },
];

export const validateLogin = (email: string, password: string): User | null => {
  // Simple validation - any password works for existing users
  const user = HARDCODED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
};