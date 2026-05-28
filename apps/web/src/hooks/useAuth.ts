import { useMutation } from '@tanstack/react-query';

// API base URL


// Types
interface User {
  id: number;
  email: string;
  name: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface RegisterData {
  email: string;
  name: string;
}

// Login mutation
export function useLogin() {
  return useMutation({
    mutationFn: async (email: string): Promise<LoginResponse> => {
      const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store token and user in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: async (userData: RegisterData): Promise<LoginResponse> => {
      const response = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store token and user in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

// Get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getCurrentUser();
}

// Logout function
export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}
