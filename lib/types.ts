// DB stores these as strings (SQLite doesn't support enums)

export const MembershipRole = {
  Owner: "Owner",
  Admin: "Admin",
  Member: "Member",
} as const;
export type MembershipRole = (typeof MembershipRole)[keyof typeof MembershipRole];

export const TaskStatus = {
  Todo: "Todo",
  InProgress: "InProgress",
  Done: "Done",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const SupportRequestStatus = {
  Open: "Open",
  InProgress: "InProgress",
  Resolved: "Resolved",
  Closed: "Closed",
} as const;
export type SupportRequestStatus =
  (typeof SupportRequestStatus)[keyof typeof SupportRequestStatus];
