import type { IdName } from "./common";
import type { Meta } from "./meta";

export type UserRole = 'admin' | 'cashier' | 'kitchen' | 'owner' | 'finance';

export type AccessKey =
  | 'read:orders'
  | 'create:orders'
  | 'update:menu'
  | 'view:dashboard'
  | 'manage:employee'
  | 'report:finance'
  | 'all'

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole[]; // jika bisa banyak role
  access: AccessKey[];
  assigned_branch: IdName[];
  activity: {
    is_active: boolean;
    branch: IdName;
    last_active: Date;
  }
  meta: Meta
}