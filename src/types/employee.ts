import type { IdName } from "./common";
import type { Meta } from "./meta";
import type { Shift, ShiftCashier, ShiftKitchen, ShiftWarehouse } from "./shift";

export type UserRole = 'admin' | 'pemilik' | 'bendahara' | 'gudang' | 'dapur' | 'kasir';

export type AccessKey =
// owner
  | 'all'
  | 'r:active-employee'
  | 'r:timesheet'
  | 'u:timesheet'
  | 'c:reservation'
  | 'r:reservation'
  | 'u:reservation'
  | 'd:reservation'
  | 'c:branch'
  | 'r:branch'
  | 'u:branch'
  | 'd:branch'
  | 'c:employee'
  | 'r:employee'
  | 'u:employee'
  | 'd:employee'
  
// finance
  | 'r:total-all-income'
  | 'r:total-income'
  | 'r:total-order'
  | 'r:total-expense'
  | 'c:transaction'
  | 'r:transaction'
  | 'u:transaction'
  | 'd:transaction'
  | 'c:fund-request'
  | 'r:fund-request'
  | 'u:fund-request'
  | 'd:fund-request'

// inventory
  | 'r:active-stock-request'
  | 'c:stock-request'
  | 'r:stock-request'
  | 'u:stock-request'
  | 'd:stock-request'
  | 'c:stock'
  | 'r:stock'
  | 'u:stock'
  | 'd:stock'
  | 'c:stock-category'
  | 'r:stock-category'
  | 'u:stock-category'
  | 'd:stock-category'
  | 'c:stock-movement'
  | 'r:stock-movement'
  | 'u:stock-movement'
  | 'd:stock-movement'

// kitchen
  | 'r:active-order'
  | 'c:order'
  | 'u:order'
  | 'd:order'
  | 'r:order-que'
  | 'r:order-history'
  | 'u:order-history'
  | 'd:order-history'
  | 'c:menu'
  | 'r:menu'
  | 'u:menu'
  | 'd:menu'
  | 'c:menu-category'
  | 'r:menu-category'
  | 'u:menu-category'
  | 'd:menu-category'

export interface Employee {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole | null;
  assigned_branch: IdName;
  activity: {
    shift_emp: Shift | null;
    shift_op: ShiftCashier | ShiftKitchen | ShiftWarehouse | null;
    is_active: boolean;
    branch: IdName | null;
    last_active: Date;
  }
  meta: Meta
}

export type UpdateEmployeePayloadByOwner = Pick<Employee, 'uid' | 'role'> & {
  assigned_branch_id: string;
}

export type UpdateEmployeeByEmployee = Pick<Employee, 'uid' | 'name' | 'email'>

export type CreateEmployeePayload = Omit<Employee, 'assigned_branch' | 'activity' | 'meta'> & {
  assigned_branch_id: string;
}