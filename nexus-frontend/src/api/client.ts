import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
  account_status: string;
  ai_interactions_count: number;
  transactions_count: number;
}

export const adminUsers = async (): Promise<AdminUser[]> => {
  const response = await client.get('/admin/users');
  return response.data;
};

export const toggleUserStatus = async (id: number): Promise<{ message: string, user: { id: number, account_status: string } }> => {
  const response = await client.put(`/admin/users/${id}/toggle-status`);
  return response.data;
};

export const updateUserRole = async (id: number, role: string): Promise<{ message: string, user: { id: number, role: string } }> => {
  const response = await client.put(`/admin/users/${id}/role`, { role });
  return response.data;
};
