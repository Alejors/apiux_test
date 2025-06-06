import { apiFetch } from "./requests";

export async function login(email: string, password: string) {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
export async function logout() {
  await apiFetch('/auth/logout', { method: 'POST' });
}
