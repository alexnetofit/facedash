export interface User {
  id: string;
  email: string;
  name: string;
  facebookId?: string;
  facebookToken?: string;
  facebookTokenExpires?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  userID: string;
  data?: {
    name?: string;
    email?: string;
  };
} 