export function convertStringToBoolean(val: string | boolean) {
  if (val === 'TRUE' || val === 'true' || val === '1' || val === 'active') {
    return true;
  } else if (val === 'FALSE' || val === 'false' || val === '0' || val === 'inactive') {
    return false;
  } else {
    return undefined;
  }
}
