export function isAdmin(userType: string | string[]) {
  if (
    typeof userType === 'string' &&
    (userType === 'admin' || userType === 'superadmin')
  ) {
    return true;
  } else if (
    Array.isArray(userType) &&
    (userType.includes('admin') || userType.includes('superadmin'))
  ) {
    return true;
  } else {
    return false;
  }
}
