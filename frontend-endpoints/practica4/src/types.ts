export type RoleItem = string | { id?: number; name: string };
export type CountryItem = string | { id?: number; name: string };

export interface User {
  id: number;
  name: string;
  email?: string;
  age?: number;
  country?: CountryItem;
  roles?: RoleItem[];
}

export function getUserIdFromToken(token: string): number | string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? payload.user_id ?? payload.id ?? null;
  } catch {
    return null;
  }
}

export function formatCountry(country?: CountryItem): string {
  if (!country) return "Sin especificar";
  return typeof country === "string" ? country : country.name;
}

export function formatRoles(roles?: RoleItem[]): string {
  if (!roles || roles.length === 0) return "Sin roles";
  return roles.map((r) => (typeof r === "string" ? r : r.name)).join(", ");
}