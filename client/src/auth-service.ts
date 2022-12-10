import jwtDecode from 'jwt-decode';
import axios, { AxiosRequestConfig } from 'axios';
import * as url from 'url';
import * as keytar from 'keytar';
import * as os from 'os';

interface GoogleProfile {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}
interface EmailProfile {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}
type Profile = GoogleProfile | EmailProfile;

const { REDIRECT_URL, KEYTAR_SERVICE, AUTH0_DOMAIN, CLIENT_ID, API_IDENTIFIER } = process.env;
const KEYTAR_ACCOUNT = os.userInfo().username;

export class AuthService {
  accessToken: string | null;
  profile: Profile | null;
  refreshToken: string | null;

  constructor() {
    this.clearData();
  }

  get authenticationUrl() {
    return `https://${AUTH0_DOMAIN}/authorize?audience=${API_IDENTIFIER}&scope=openid profile user_metadata offline_access email&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}`;
  }

  get logoutUrl() {
    return `https://${AUTH0_DOMAIN}/v2/logout`;
  }

  get userId() {
    const subArray = this.profile?.sub?.split('|');
    if (subArray[0] === 'auth0') {
      return subArray[1];
    }
    return null;
  }

  clearData() {
    this.accessToken = null;
    this.profile = null;
    this.refreshToken = null;
  }

  async refreshTokens() {
    const refreshToken = await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    if (refreshToken) {
      const refreshOptions = {
        method: 'POST',
        url: `https://${AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        data: {
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
          refresh_token: refreshToken
        }
      };
      try {
        const response = await axios(refreshOptions);
        const { access_token, id_token } = response.data;
        this.accessToken = access_token;
        this.profile = jwtDecode(id_token);
      } catch (error) {
        await this.logout();
        throw error;
      }
    } else {
      throw new Error('No available refresh token.');
    }
  }

  async loadTokens(callbackUrl: string) {
    const query = url.parse(callbackUrl, true).query;
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `https://${AUTH0_DOMAIN}/oauth/token`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'accept-encoding': 'identity'
      },
      responseType: 'json',
      data: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: query.code,
        redirect_uri: REDIRECT_URL
      })
    };

    try {
      const response = await axios(options);
      const { access_token, id_token, refresh_token } = response.data;
      this.accessToken = access_token;
      this.profile = jwtDecode(id_token);
      this.refreshToken = refresh_token;
      if (this.refreshToken) {
        await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, this.refreshToken);
      }
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async logout() {
    await keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    this.clearData();
  }
}
