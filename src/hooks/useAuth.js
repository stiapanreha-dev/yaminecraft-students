import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getUserById, createUser } from '@/services/firestore';

/**
 * Hook для работы с аутентификацией
 * @returns {Object} - методы и состояние авторизации
 */
export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Получаем данные пользователя из Firestore
          const userData = await getUserById(firebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  /**
   * Вход с email и паролем
   */
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await firebaseSignIn(auth, email, password);
      const userData = await getUserById(userCredential.user.uid);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Регистрация с email и паролем
   */
  const signUp = async (email, password, profileData) => {
    try {
      setLoading(true);
      const userCredential = await firebaseSignUp(auth, email, password);

      // Создаём документ пользователя в Firestore
      const userData = await createUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: 'student', // По умолчанию роль ученика
        profile: profileData
      });

      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выход из системы
   */
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
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
