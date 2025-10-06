import { useAuthStore } from '@/store/authStore';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getUserById, createUser } from '@/services/firestore';

/**
 * Hook для работы с аутентификацией
 * @returns {Object} - методы и состояние авторизации
 */
export const useAuth = () => {
  const { user, loading } = useAuthStore();

  /**
   * Вход с email и паролем
   */
  const signIn = async (email, password) => {
    try {
      const userCredential = await firebaseSignIn(auth, email, password);
      // onAuthStateChanged will handle loading and user state
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Регистрация с email и паролем
   */
  const signUp = async (email, password, profileData) => {
    try {
      const userCredential = await firebaseSignUp(auth, email, password);

      // Создаём документ пользователя в Firestore
      const userData = {
        email: userCredential.user.email,
        role: 'student', // По умолчанию роль ученика
        profile: profileData
      };

      const result = await createUser(userCredential.user.uid, userData);

      if (result.error) {
        throw new Error(result.error);
      }

      // onAuthStateChanged will handle loading and user state
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Выход из системы
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle loading and user state
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Проверка роли пользователя
   */
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isStudent,
    isAuthenticated: !!user
  };
};
