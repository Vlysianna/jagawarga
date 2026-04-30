import { USERS } from "@/lib/data/users";
import { AuthUser, User, UserRole } from "@/lib/types/user";

const AUTH_COOKIE = "jagawarga_auth";

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    scope_id: user.scope_id,
    detail: user.detail,
  };
}

function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function login(
  email: string,
  password: string
): { success: true; user: AuthUser } | { success: false; error: string } {
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, error: "Email atau password salah" };
  }

  const authUser = toAuthUser(user);

  if (typeof window !== "undefined") {
    setCookie(AUTH_COOKIE, JSON.stringify(authUser));
  }

  return { success: true, user: authUser };
}

export function logout(): void {
  if (typeof window !== "undefined") {
    deleteCookie(AUTH_COOKIE);
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const stored = getCookie(AUTH_COOKIE);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "citizen":
      return "/citizen/dashboard";
    case "rt":
      return "/rt/dashboard";
    case "rw":
      return "/rw/dashboard";
    case "kel":
    case "kec":
    case "pemda":
    case "pemprov":
      return "/pemda/dashboard";
  }
}
