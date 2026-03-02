export type Role = "USER" | "ADMIN" | "SHOP_OWNER";

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  password?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
