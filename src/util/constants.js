export const PRIORITY_LABELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  OPTIONAL: 'Nice-to-have',
};
export const STATUS_LABELS = {
  DRAFT: 'Draft',
  PROPOSED: 'Proposed',
  APPROVED: 'Approved',
  DEPRECATED: 'Deprecated',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS)
  .map(([value, label]) => ({ value, label }));

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS)
  .map(([value, label]) => ({ value, label }));

// Safe display helper (falls back to the raw value)
export const label = (map, value) => map[value] ?? value;