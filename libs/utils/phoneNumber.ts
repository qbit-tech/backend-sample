// e.g countryCode = 62;

export function cleanPhoneNumber(phoneNumber: string, countryCode?: string) {
  console.info(
    'cleanPhoneNumber::: phone: ' +
      phoneNumber +
      ' ::: countryCode: ' +
      countryCode,
  );
  if (!countryCode) {
    // countryCode = '62';
    // console.info('set auto 62 for country code');
    console.info('there is no country code');
  }
  if (!phoneNumber) return null;

  phoneNumber = phoneNumber.replace(/\s/g, '');
  phoneNumber = phoneNumber.replace(/\+/g, '');

  console.info('cleanPhoneNumber #1 -- ', phoneNumber);

  if (phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.substring(1, phoneNumber.length);
  }
  if (countryCode) {
    if (phoneNumber.startsWith(countryCode)) {
      phoneNumber = phoneNumber.replace(countryCode, '');
    }
    phoneNumber = countryCode + phoneNumber;
  }

  console.info('cleanPhoneNumber #2 -- ', phoneNumber);

  return phoneNumber;
}
