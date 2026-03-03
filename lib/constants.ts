export const APP_NAME = "Taskflow";
export const PAGINATION_DEFAULT = 10;
export const ROLES = ["Owner", "Admin", "Member"] as const;
export type MembershipRole = (typeof ROLES)[number];
