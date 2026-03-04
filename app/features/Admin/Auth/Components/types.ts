export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AdminRegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface OwnerRegisterForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carColor: string;
  plateNumber: string;
  password: string;
  confirmPassword: string;
}