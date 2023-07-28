export function generateBodyUpdate(body: any, fields: string[]) {
  if (!body) {
    return {};
  }
  const newBody: any = {};

  for (const field of fields) {
    if (body.hasOwnProperty(field)) {
      newBody[field] = body[field];
    }
  }

  return newBody;
}
