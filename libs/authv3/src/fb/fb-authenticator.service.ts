import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { getAuthSettingToken } from "../authentication.helper";
import { FacebookAuthenticationResponse, FacebookOption } from "./fb-authenticator.contract";
import { map } from 'rxjs/operators';

@Injectable()
export class FBAuthenticatorService {
  private readonly logger = new Logger(FBAuthenticatorService.name);

  constructor(
    private httpService: HttpService,
    @Inject(getAuthSettingToken('fb'))
    private readonly authOption: FacebookOption,
  ){}
  
  async authenticate(params: {token: string}): Promise<FacebookAuthenticationResponse> {
    this.logger.log('Validate fb auth, token: '+params.token);
    const accessToken = await this.getAppToken();
    const resp = await this.validateClientToken(accessToken, params.token)

    if (resp.app_id !== this.authOption.appId || Date.now().valueOf() > resp.data_access_expires_at*1000){
      resp.is_valid = false
    }
    if(resp.is_valid){
      const user = await this.getUserData(params.token);
      resp.email = user.email;
      resp.name = user.name;
    }
    return resp
  }

  async getAppToken(): Promise<string> {
    const path =
      "https://graph.facebook.com/oauth/access_token?client_id=" +
      this.authOption.appId +
      "&client_secret=" +
      this.authOption.appSecret +
      "&grant_type=client_credentials";

    return this.httpService.get<{access_token: string}>(path)
    .pipe(
      map(response => response.data.access_token)
    )
    .toPromise();
  };

  async validateClientToken(appToken: string, clientToken: string): Promise<FacebookAuthenticationResponse>{
    const path =
      "https://graph.facebook.com/debug_token?input_token=" +
      clientToken +
      "&access_token=" +
      appToken;
    
    return this.httpService.get<{data: FacebookAuthenticationResponse}>(path)
    .pipe(
      map(response => response.data.data)
    )
    .toPromise();
  };

  async getUserData(clientToken: string): Promise<{name: string, email: string}> {
    const path =
      "https://graph.facebook.com/v15.0/me?fields=name,email&access_token=" +
      clientToken;

    return this.httpService.get<{name: string, email: string, id: string}>(path)
    .pipe(
      map(response => {
        return {
          name: response.data.name,
          email: response.data.email
        }
      })
    )
    .toPromise();
  }
}