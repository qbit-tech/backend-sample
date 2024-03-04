import { EXAMPLE_BASE_PERMISSIONS } from '@qbit-tech/libs-session';
import { RoleModel } from '@qbit-tech/libs-role';

export const ROLE_SUPERADMIN_ID = '0747b5d6-1a5c-4955-a9c9-91122884da99';
export const ROLE_ADMIN_ID = 'e204ca41-875f-4499-939b-aa312e40128a';
export const ROLE_CUSTOMER_ID = '4ce388ae-b756-47f3-bf32-9bb245f065b7';

export const DEFAULT_ROLES: Partial<RoleModel>[] = [
  {
    roleId: ROLE_SUPERADMIN_ID,
    roleName: 'Super Admin',
    roleDescription: 'Super admin can do all actions.',
    permissions: EXAMPLE_BASE_PERMISSIONS,
    isActive: true,
    isDeleted: false,
  },
  {
    roleId: ROLE_CUSTOMER_ID,
    roleName: 'Customer',
    roleDescription: 'Customer',
    permissions: EXAMPLE_BASE_PERMISSIONS,
    isActive: true,
    isDeleted: false,
  },
];

