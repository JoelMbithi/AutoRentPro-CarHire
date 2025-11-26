

// ------------------------
// Request body for signup

import { UserRole } from "@/app/generated/prisma/enums";

// ------------------------
export type SignupRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  drivingLicense: string;
  dateOfBirth?: string; // optional, ISO string
  address?: string;
};

// ------------------------
// Prisma user select type
// ------------------------
export type CreatedUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  drivingLicense: string;
  role: UserRole;
  createdAt: Date;
};

// ------------------------
// Response types for signup
// ------------------------
export type SignupSuccessResponse = {
  success: true;
  message: string;
  user: CreatedUser;
  token: string;
};

export type SignupErrorResponse = {
  success: false;
  error: string;
  details?: any; // Optional validation errors, etc.
};
