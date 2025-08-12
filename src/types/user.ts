import type { IdName } from "./common";
import type { Meta } from "./meta";

export interface User {
  id: string;
  name: string;
  phone: string;
  branch: IdName;
  table: string;
  meta: Meta
}

export type CreateUser = Omit<User, 'id' | 'branch' | 'meta'> & {
  branch_id: string;
}

export type UpdateUser = CreateUser & {
  id: string;
}