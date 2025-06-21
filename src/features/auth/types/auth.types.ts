export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  user: any | null;
}