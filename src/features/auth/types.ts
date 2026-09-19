export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  sapCustomerId?: string;
  parentMerchantId?: string | null;
  parentMerchantName?: string | null;
  isSubCustomer?: boolean;
  isMainCustomer?: boolean;
  isMerchant?: boolean;
  customerType?: string | number;
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

export interface SendOtpDto {
  phoneNumber: string;
}

export interface VerifyOtpDto {
  phoneNumber: string;
  code: string;
}
