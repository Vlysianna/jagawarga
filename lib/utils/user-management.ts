import { getDashboardPath } from "@/lib/utils/auth";
import { isWithinScope } from "@/lib/utils/scope";
import { AuthUser, ROLE_LABELS, User, UserRole } from "@/lib/types/user";

const MANAGED_ROLE_BY_ROLE: Partial<Record<UserRole, UserRole>> = {
  rt: "citizen",
  rw: "rt",
  kel: "rw",
  kec: "kel",
  pemda: "kec",
  pemprov: "pemda",
};

export function getUsersBasePath(role: UserRole): string {
  return getDashboardPath(role).replace("/dashboard", "");
}

export function getManagedRole(role: UserRole): UserRole | null {
  return MANAGED_ROLE_BY_ROLE[role] ?? null;
}

export function canManageUsers(role: UserRole): boolean {
  return getManagedRole(role) !== null;
}

export function getVisibleManagedUsers(
  users: User[],
  authUser: AuthUser
): User[] {
  const managedRole = getManagedRole(authUser.role);
  if (!managedRole) return [];

  return users.filter(
    (user) =>
      user.role === managedRole && isWithinScope(user.scope_id, authUser.scope_id)
  );
}

export function getVisibleElderlyUsers(
  users: User[],
  authUser: AuthUser
): User[] {
  return users.filter(
    (user) =>
      user.role === "citizen" &&
      user.is_lansia &&
      isWithinScope(user.scope_id, authUser.scope_id)
  );
}

export function getManagedRoleLabel(role: UserRole): string {
  const managedRole = getManagedRole(role);
  return managedRole ? ROLE_LABELS[managedRole] : "User";
}
