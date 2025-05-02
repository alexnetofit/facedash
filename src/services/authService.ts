import { User, AuthState, FacebookAuthResponse } from '../types/auth';

class AuthService {
  private readonly API_URL = process.env.REACT_APP_API_URL || '';

  async login(email: string, password: string): Promise<AuthState> {
    const response = await fetch(`${this.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }

    return response.json();
  }

  async register(email: string, password: string, name: string): Promise<AuthState> {
    const response = await fetch(`${this.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      throw new Error('Falha no registro');
    }

    return response.json();
  }

  async loginWithFacebook(facebookData: FacebookAuthResponse): Promise<AuthState> {
    // Como não temos backend, vamos simular um login bem-sucedido
    const mockUser: User = {
      id: '1',
      email: facebookData.data?.email || 'facebook-user@example.com',
      name: facebookData.data?.name || 'Usuário Facebook',
      facebookId: facebookData.userID,
      facebookToken: facebookData.accessToken,
      facebookTokenExpires: Date.now() + (facebookData.expiresIn * 1000)
    };

    const mockAuthState: AuthState = {
      user: mockUser,
      token: 'mock-token-' + Date.now()
    };

    return Promise.resolve(mockAuthState);
  }

  async linkFacebookAccount(userId: string, facebookData: FacebookAuthResponse): Promise<User> {
    const response = await fetch(`${this.API_URL}/auth/facebook/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`,
      },
      body: JSON.stringify(facebookData),
    });

    if (!response.ok) {
      throw new Error('Falha ao vincular conta do Facebook');
    }

    return response.json();
  }

  async unlinkFacebookAccount(userId: string): Promise<User> {
    const response = await fetch(`${this.API_URL}/auth/facebook/unlink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao desvincular conta do Facebook');
    }

    return response.json();
  }
}

export const authService = new AuthService(); 