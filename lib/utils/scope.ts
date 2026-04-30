export const SCOPE_LEVELS = [
  "pemprov",
  "pemda",
  "kec",
  "kel",
  "rw",
  "rt",
] as const;

export type ScopeLevel = (typeof SCOPE_LEVELS)[number];
export type ScopeParts = Partial<Record<ScopeLevel, string>>;

export function joinScopeIds(
  ...ids: Array<string | null | undefined>
): string {
  return ids.filter((id): id is string => Boolean(id)).join(".");
}

export function parseScopeId(scopeId: string): ScopeParts {
  const ids = scopeId.split(".").filter(Boolean);

  return SCOPE_LEVELS.reduce<ScopeParts>((parts, level, index) => {
    const id = ids[index];
    if (id) {
      parts[level] = id;
    }
    return parts;
  }, {});
}

export function buildScopeId(parts: ScopeParts): string {
  const ids: string[] = [];

  for (const level of SCOPE_LEVELS) {
    const id = parts[level];
    if (!id) break;
    ids.push(id);
  }

  return joinScopeIds(...ids);
}

export function getScopeLevel(scopeId: string): ScopeLevel | null {
  const ids = scopeId.split(".").filter(Boolean);
  return SCOPE_LEVELS[ids.length - 1] ?? null;
}

export function getScopeParentId(scopeId: string): string | null {
  const ids = scopeId.split(".").filter(Boolean);
  if (ids.length <= 1) return null;
  return joinScopeIds(...ids.slice(0, -1));
}

export function getScopePart(scopeId: string, level: ScopeLevel): string | null {
  return parseScopeId(scopeId)[level] ?? null;
}

export function appendScopeId(
  scopeId: string,
  ...childIds: Array<string | null | undefined>
): string {
  return joinScopeIds(scopeId, ...childIds);
}

export function isWithinScope(scopeId: string, parentScopeId: string): boolean {
  return scopeId === parentScopeId || scopeId.startsWith(`${parentScopeId}.`);
}
