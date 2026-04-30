"use client";

import { USERS } from "@/lib/data/users";
import { ElderlyVisitSchedule, User } from "@/lib/types/user";

const USERS_STORAGE_KEY = "jagawarga_users";
const ELDERLY_VISITS_STORAGE_KEY = "jagawarga_elderly_visits";

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

export function readElderlyVisits(): ElderlyVisitSchedule[] {
  if (!hasWindow()) {
    return [];
  }

  const stored = window.localStorage.getItem(ELDERLY_VISITS_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as ElderlyVisitSchedule[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeElderlyVisits(
  visits: ElderlyVisitSchedule[]
): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(
    ELDERLY_VISITS_STORAGE_KEY,
    JSON.stringify(visits)
  );
}

export function upsertElderlyVisit(
  nextVisit: ElderlyVisitSchedule
): ElderlyVisitSchedule[] {
  const current = readElderlyVisits();
  const exists = current.some((visit) => visit.id === nextVisit.id);
  const nextVisits = exists
    ? current.map((visit) => (visit.id === nextVisit.id ? nextVisit : visit))
    : [nextVisit, ...current];

  writeElderlyVisits(nextVisits);
  return nextVisits;
}

export function removeElderlyVisit(visitId: string): ElderlyVisitSchedule[] {
  const nextVisits = readElderlyVisits().filter((visit) => visit.id !== visitId);
  writeElderlyVisits(nextVisits);
  return nextVisits;
}

export function createVisitId(): string {
  return `visit-${Math.random().toString(36).slice(2, 10)}`;
}
