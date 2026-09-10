export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  sapCustomerId?: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  expiresIn?: number;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role?: string;
}
