export interface FacebookAuthenticationResponse {
  app_id: string,
  application: string,
  data_access_expires_at: number,
  expires_at: number,
  is_valid: boolean,
  scopes: string[],
  type: string,
  user_id: string,
  name?: string,
  email?: string,
}

export type FacebookOption = {
  appId: string;
  appSecret: string;
}