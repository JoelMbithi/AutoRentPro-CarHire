import { UserRole } from "@/app/generated/prisma/enums"; 

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
