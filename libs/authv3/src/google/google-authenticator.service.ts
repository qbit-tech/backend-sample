import { Injectable, Inject, Logger } from "@nestjs/common";
import { GoogleAuthenticationResponse, GoogleOption } from "./google-authenticator.contract";
import { OAuth2Client } from 'google-auth-library'
import { getAuthSettingToken } from '../authentication.helper';

@Injectable()
export class GoogleAuthenticatorService {
  private readonly logger = new Logger(GoogleAuthenticatorService.name);
  private client;

  constructor(
    @Inject(getAuthSettingToken('google'))
    private readonly authOption: GoogleOption,
  ) {
    this.client = new OAuth2Client();
  }

  async authenticate(params: {
    token: string
  }): Promise<GoogleAuthenticationResponse> {
    this.logger.log('Validate google token: '+params.token);

    const result = await this.client.verifyIdToken({
      idToken: params.token,
      audience: this.authOption.appId
    });
    const payload = result.getPayload();

    return payload;
  }
}
