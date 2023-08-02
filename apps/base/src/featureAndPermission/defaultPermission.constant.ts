
import { FEATURE_PERMISSIONS } from './featureAndPermission.constant';
import { PERMISSIONS_VIEW } from './predefinedPermission.constant';

const DEFAULT_PERMISSION_FULL_ACCESS = JSON.parse(JSON.stringify(FEATURE_PERMISSIONS));
const DEFAULT_PERMISSION_MINIMUM_ACCESS = JSON.parse(JSON.stringify(FEATURE_PERMISSIONS));
const DEFAULT_PERMISSION_NO_ACCESS = JSON.parse(JSON.stringify(FEATURE_PERMISSIONS));
const DEFAULT_PERMISSION_CUSTOMER = JSON.parse(
  JSON.stringify(FEATURE_PERMISSIONS),
);

for (const feature in DEFAULT_PERMISSION_MINIMUM_ACCESS) {
  for (const permission in DEFAULT_PERMISSION_MINIMUM_ACCESS[feature]) {
    if (DEFAULT_PERMISSION_MINIMUM_ACCESS[feature][permission] && typeof DEFAULT_PERMISSION_MINIMUM_ACCESS[feature][permission] === 'object') {
      DEFAULT_PERMISSION_MINIMUM_ACCESS[feature][permission].value =
        permission === PERMISSIONS_VIEW.DETAIL.__type || permission === PERMISSIONS_VIEW.LIST.__type;
    }
  }
}

for (const feature in DEFAULT_PERMISSION_NO_ACCESS) {
  for (const permission in DEFAULT_PERMISSION_NO_ACCESS[feature]) {
    if (DEFAULT_PERMISSION_NO_ACCESS[feature][permission] && typeof DEFAULT_PERMISSION_NO_ACCESS[feature][permission] === 'object') {
      DEFAULT_PERMISSION_NO_ACCESS[feature][permission].value = false;
    }
  }
}

for (const feature in DEFAULT_PERMISSION_CUSTOMER) {
  for (const permission in DEFAULT_PERMISSION_CUSTOMER[feature]) {
    if (
      DEFAULT_PERMISSION_CUSTOMER[feature][permission] &&
      typeof DEFAULT_PERMISSION_CUSTOMER[feature][permission] === 'object'
    ) {
      if (feature === 'AUTH' && permission === 'LOGIN_MOBILE_APP_CUSTOMER') {
        DEFAULT_PERMISSION_CUSTOMER[feature][permission].value = true;
      } else if (permission === 'LIST' || permission === 'DETAIL') {
        DEFAULT_PERMISSION_CUSTOMER[feature][permission].value = true;
      } else {
        DEFAULT_PERMISSION_CUSTOMER[feature][permission].value = false;
      }
    }
  }
}

export {
  DEFAULT_PERMISSION_FULL_ACCESS,
  DEFAULT_PERMISSION_MINIMUM_ACCESS,
  DEFAULT_PERMISSION_NO_ACCESS,
  DEFAULT_PERMISSION_CUSTOMER,
};