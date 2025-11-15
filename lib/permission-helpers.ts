import { Admin, Permission } from '@/types';

/**
 * Check if an admin has a specific permission
 * @param admin - Admin user object
 * @param permission - Permission to check
 * @returns true if admin has the permission
 */
export function hasPermission(
  admin: Admin | null | undefined,
  permission: Permission
): boolean {
  if (!admin) return false;

  // Super admins have all permissions
  if (admin.role === 'super_admin') {
    return true;
  }

  // Check if admin has the specific permission
  if (admin.permissions && admin.permissions.includes(permission)) {
    return true;
  }

  return false;
}

/**
 * Require a specific permission (throws error if not authorized)
 * @param admin - Admin user object
 * @param permission - Permission required
 * @throws Error if admin doesn't have the permission
 */
export function requirePermission(
  admin: Admin | null | undefined,
  permission: Permission
): void {
  if (!hasPermission(admin, permission)) {
    throw new Error(
      `Unauthorized: ${permission} permission required`
    );
  }
}

/**
 * Check if admin has any of the specified permissions
 * @param admin - Admin user object
 * @param permissions - Array of permissions to check
 * @returns true if admin has at least one of the permissions
 */
export function hasAnyPermission(
  admin: Admin | null | undefined,
  permissions: Permission[]
): boolean {
  if (!admin) return false;

  // Super admins have all permissions
  if (admin.role === 'super_admin') {
    return true;
  }

  // Check if admin has any of the permissions
  if (admin.permissions) {
    return permissions.some((permission) =>
      admin.permissions!.includes(permission)
    );
  }

  return false;
}

/**
 * Check if admin has all of the specified permissions
 * @param admin - Admin user object
 * @param permissions - Array of permissions to check
 * @returns true if admin has all of the permissions
 */
export function hasAllPermissions(
  admin: Admin | null | undefined,
  permissions: Permission[]
): boolean {
  if (!admin) return false;

  // Super admins have all permissions
  if (admin.role === 'super_admin') {
    return true;
  }

  // Check if admin has all of the permissions
  if (admin.permissions) {
    return permissions.every((permission) =>
      admin.permissions!.includes(permission)
    );
  }

  return false;
}

/**
 * Get default permissions for a given role
 * @param role - Admin role
 * @returns Array of default permissions for the role
 */
export function getDefaultPermissions(
  role: 'super_admin' | 'moderator'
): Permission[] {
  if (role === 'super_admin') {
    // Super admins get all permissions
    return Object.values(Permission);
  }

  // Moderators get limited permissions
  return [
    Permission.VIEW_USERS,
    Permission.VIEW_JOBS,
    Permission.HOLD_JOBS,
    Permission.VIEW_FEATURED_REQUESTS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_ANALYTICS,
    Permission.SEND_MESSAGES,
  ];
}

/**
 * Permission descriptions for UI display
 */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [Permission.VIEW_USERS]: 'View all users',
  [Permission.MANAGE_USERS]: 'Edit user profiles and settings',
  [Permission.SUSPEND_USERS]: 'Suspend and unsuspend user accounts',
  [Permission.DELETE_USERS]: 'Delete user accounts',

  [Permission.VIEW_JOBS]: 'View all jobs',
  [Permission.MANAGE_JOBS]: 'Edit job details',
  [Permission.HOLD_JOBS]: 'Put jobs on hold or activate them',
  [Permission.DELETE_JOBS]: 'Delete jobs',

  [Permission.VIEW_FEATURED_REQUESTS]: 'View featured job requests',
  [Permission.APPROVE_FEATURED_REQUESTS]: 'Approve or reject featured job requests',
  [Permission.MANAGE_FEATURED_JOBS]: 'Manage featured job carousel',

  [Permission.MANAGE_SETTINGS]: 'Modify platform settings',
  [Permission.VIEW_AUDIT_LOGS]: 'View admin activity logs',
  [Permission.MANAGE_PERMISSIONS]: 'Manage admin roles and permissions',
  [Permission.VIEW_ANALYTICS]: 'View platform analytics',

  [Permission.SEND_MESSAGES]: 'Send individual messages to users',
  [Permission.SEND_BULK_MESSAGES]: 'Send bulk messages to multiple users',
};

/**
 * Permission categories for grouped UI display
 */
export const PERMISSION_CATEGORIES = {
  'User Management': [
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.SUSPEND_USERS,
    Permission.DELETE_USERS,
  ],
  'Job Management': [
    Permission.VIEW_JOBS,
    Permission.MANAGE_JOBS,
    Permission.HOLD_JOBS,
    Permission.DELETE_JOBS,
  ],
  'Featured Jobs': [
    Permission.VIEW_FEATURED_REQUESTS,
    Permission.APPROVE_FEATURED_REQUESTS,
    Permission.MANAGE_FEATURED_JOBS,
  ],
  'System & Administration': [
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_PERMISSIONS,
    Permission.VIEW_ANALYTICS,
  ],
  'Messaging': [
    Permission.SEND_MESSAGES,
    Permission.SEND_BULK_MESSAGES,
  ],
};

/**
 * Check if admin can perform a specific action
 * Convenience functions for common permission checks
 */
export const canViewUsers = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.VIEW_USERS);

export const canManageUsers = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.MANAGE_USERS);

export const canSuspendUsers = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.SUSPEND_USERS);

export const canDeleteUsers = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.DELETE_USERS);

export const canViewJobs = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.VIEW_JOBS);

export const canManageJobs = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.MANAGE_JOBS);

export const canHoldJobs = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.HOLD_JOBS);

export const canDeleteJobs = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.DELETE_JOBS);

export const canApproveFeaturedRequests = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.APPROVE_FEATURED_REQUESTS);

export const canManageSettings = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.MANAGE_SETTINGS);

export const canViewAuditLogs = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.VIEW_AUDIT_LOGS);

export const canManagePermissions = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.MANAGE_PERMISSIONS);

export const canSendMessages = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.SEND_MESSAGES);

export const canSendBulkMessages = (admin: Admin | null | undefined) =>
  hasPermission(admin, Permission.SEND_BULK_MESSAGES);
