import api from './axiosInstance';
import { LoginCredentials, User } from '../types';

export async function loginApi(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  const res = await api.post('/login', credentials);
  return res.data;
}

export async function getUserProfile(): Promise<User> {
  const res = await api.get('/users/user');
  return res.data;
}
