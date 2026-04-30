"use client";

import { USERS } from "@/lib/data/users";
import { User } from "@/lib/types/user";

const USERS_STORAGE_KEY = "jagawarga_users";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function readUsers(): User[] {
  if (!hasWindow()) {
    return USERS;
  }

  const stored = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    return USERS;
  }

  try {
    const parsed = JSON.parse(stored) as User[];
    return Array.isArray(parsed) ? parsed : USERS;
  } catch {
    return USERS;
  }
}

export function writeUsers(users: User[]): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function upsertUser(nextUser: User): User[] {
  const current = readUsers();
  const exists = current.some((user) => user.id === nextUser.id);
  const nextUsers = exists
    ? current.map((user) => (user.id === nextUser.id ? nextUser : user))
    : [nextUser, ...current];

  writeUsers(nextUsers);
  return nextUsers;
}

export function removeUser(userId: string): User[] {
  const nextUsers = readUsers().filter((user) => user.id !== userId);
  writeUsers(nextUsers);
  return nextUsers;
}

export function createUserId(role: User["role"]): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${role}-${suffix}`;
}
