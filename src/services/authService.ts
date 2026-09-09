import rawUsers from '../data/auth.json';
import { UserProfile } from '../types/user';

interface AuthUser extends UserProfile {
  password: string;
}

const users: AuthUser[] = rawUsers as AuthUser[];

export const authService = {
  async login(emailOrPhone: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const input = emailOrPhone.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === input || u.phone.replace(/\s/g, '') === input.replace(/\s/g, '')) &&
        u.password === password
    );

    if (found) {
      const { password: _, ...userProfile } = found;
      return { success: true, user: userProfile };
    }
    return { success: false, error: 'Invalid email/phone or password' };
  },

  async register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const existingEmail = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      return { success: false, error: 'Email already registered' };
    }

    const existingPhone = users.find((u) => u.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''));
    if (existingPhone) {
      return { success: false, error: 'Phone number already registered' };
    }

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      loyaltyTier: 'Silver',
      loyaltyPoints: 100,
    };

    users.push(newUser);

    const { password: _, ...userProfile } = newUser;
    return { success: true, user: userProfile };
  },

  async getAllUsers(): Promise<UserProfile[]> {
    return users.map(({ password: _, ...rest }) => rest);
  },
};
