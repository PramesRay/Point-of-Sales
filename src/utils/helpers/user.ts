import type { AccessKey, Employee, UserRole } from "@/types/employee";

export function hasAccess(user: Employee, keys: AccessKey[]): boolean {
  return keys.some(key => user.access?.includes(key) ?? false);
}

export function hasRole(user: Employee, roles: UserRole[]): boolean {
  return roles.some(role => user.role?.includes(role) ?? false);
}
