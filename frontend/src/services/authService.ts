import { apiFetch } from "./requests";
import type { ApiResponse, User } from "../types/index";

export async function login(email: string, password: string): Promise<void> {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(name: string, email: string, password: string): Promise<ApiResponse<User>> {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}
