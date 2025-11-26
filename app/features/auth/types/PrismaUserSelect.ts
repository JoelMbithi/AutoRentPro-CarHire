// /app/features/auth/types/PrismaUserSelect.ts

import { UserRole } from "@/generated/prisma";


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
