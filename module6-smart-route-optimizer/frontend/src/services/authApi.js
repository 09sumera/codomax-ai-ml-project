import { request } from './api';

export async function loginApi({ email, password }) {
  return await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signupApi({ name, email, password, role, company }) {
  return await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, company }),
  });
}

export async function getCurrentUserApi() {
  return await request('/api/auth/me', {
    method: 'GET',
  });
}

export async function getDemoAccountApi() {
  return await request('/api/auth/demo', {
    method: 'GET',
  });
}
