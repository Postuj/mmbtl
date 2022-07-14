import axios from 'axios';
import { User } from '../common/entities/User';
import {
  RefreshTokenResponse,
  SignInResponse,
} from '../common/types/responses';

type OnAuthStateChanged = (user: User | null) => void;

export class AuthService {
  private static instance?: AuthService;
  private token?: string | null;
  private onAuthStateChangedCallback?: OnAuthStateChanged;

  public static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  public getAccessToken() {
    return this.token;
  }

  public async tryRefreshTokenLogin() {
    console.log('[Auth Service] trying local login');
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;

    const result = await this.refreshAccessToken();
    return result;
  }

  public async signInWithEmail(email: string, password: string) {
    const res = await this.sendSignInWithEmailRequest(email, password);
    if (!res) {
      console.error('[Auth Service] Sign in error');
      return;
    }

    this.setTokens(res.access_token, res.refresh_token);
    this.onAuthStateChangedCallback!({
      id: res.id,
      username: res.username,
      email: res.email,
    });
  }

  public async signInWithGoogle() {
    return;
  }

  public async logOut() {
    const res = await this.sendLogOutRequest();
    if (res.status !== 200) {
      console.error('[AuthService] Logout error');
      return;
    }
    this.token = null;
    localStorage.clear();
    this.onAuthStateChangedCallback!(null);
  }

  public onAuthStateChanged(callback: OnAuthStateChanged) {
    this.onAuthStateChangedCallback = callback;
  }

  public async refreshAccessToken(): Promise<RefreshTokenResponse | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    console.log('[AuthService] Refreshing Access Token');
    const res: RefreshTokenResponse | null = await axios.post(
      'http://localhost:3001/auth/refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (!res || res.status !== 200) return null;
    const tokens = res.data;

    this.setTokens(tokens.access_token, tokens.refresh_token);
    const user = await this.fetchUser();
    this.onAuthStateChangedCallback!(user);
    return res;
  }

  private async sendSignInWithEmailRequest(
    email: string,
    password: string
  ): Promise<SignInResponse | null> {
    const res = await axios.post('http://localhost:3001/auth/signin', {
      email,
      password,
    });

    if (res.status !== 200) return null;

    return res.data;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.token = accessToken;
    localStorage.setItem('refresh_token', refreshToken);
  }

  private async fetchUser(): Promise<User> {
    const res = await axios.get('http://localhost:3001/user/profile', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return res.data;
  }

  private async sendLogOutRequest() {
    const res = await axios.post(
      'http://localhost:3001/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return res;
  }
}
