import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(email: string, password: string, displayName?: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await userCredential.user.updateProfile({ displayName });
    }
  }

  public async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  public async logout(): Promise<void> {
    await signOut(auth);
  }

  public async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }
}

export default AuthService; 