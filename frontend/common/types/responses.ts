export type SignInResponse = {
  id: number;
  email: string;
  username: string;
  access_token: string;
  refresh_token: string;
};

export type RefreshTokenResponse = {
  status: number;
  data: {
    access_token: string;
    refresh_token: string;
  };
}
