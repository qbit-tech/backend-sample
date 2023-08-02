// import { RoleProperties } from '../modules/role/role.entity';
// import { RoleProperties } from 'libs/role/src/role.entity';
import { FeaturePermissionType } from './featureAndPermission.type';

export function hasPermission(userPermissions: FeaturePermissionType, feature: string, permission: string) {
  return userPermissions[feature]?.[permission]?.value;
}

export function hasPermissionFromRoles(
  roles: any[],
  feature: string,
  permission: string,
) {
    let isHasPermission = false;
    for (const role of roles) {
      isHasPermission = hasPermission(role.permissions, feature, permission);
    }
    return isHasPermission;
  }
