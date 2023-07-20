export function removeSpecialCharacter(text: string) {
  if (!text) {
    text = ''
  }
  return text.replace(/[^a-zA-Z0-9 ]/g, '');
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function convertToReadableText(str: string) {
  if (!str) {
    return null;
  }
  str = str.replace(/[^a-zA-Z0-9]/g, ' ');
  return str;
}
