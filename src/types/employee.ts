export type UserRole = 'admin' | 'cashier' | 'kitchen' | 'owner';

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
  access?: AccessKey[];
  last_active?: Date;
  status?: 'aktif' | 'offline';
  created_at?: Date;
  updated_at?: Date;
}