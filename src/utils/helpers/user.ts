import type { AccessKey, Employee, UserRole } from "@/types/user";

export function hasAccess(user: Employee, keys: AccessKey[]): boolean {
  return keys.some(key => user.access?.includes(key) ?? false);
}

