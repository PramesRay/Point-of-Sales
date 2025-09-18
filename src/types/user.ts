import type { IdName } from "./common";
import type { Meta } from "./meta";

export interface User {
  id: string;
  fk_user_id: string;
  name: string;
  phone: string;
  branch: IdName;
  table: string;
}

export type CreateUser = {
  name: string;
  phone: string;
}

export type UpdateUser = CreateUser & {
  id: string;
}