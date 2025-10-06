import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getUserById } from '@/services/firestore';
import { useAuthStore } from '@/store/authStore';

/**
 * AuthProvider - инициализирует Firebase Auth один раз для всего приложения
 */
export const AuthProvider = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    console.log('AuthProvider: setting up onAuthStateChanged');
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthProvider: auth state changed', { user: !!firebaseUser });

      if (firebaseUser) {
        try {
          const userData = await getUserById(firebaseUser.uid);
          console.log('AuthProvider: user data loaded', { role: userData?.role });
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

    return () => {
      console.log('AuthProvider: cleanup');
      unsubscribe();
    };
  }, []); // Empty deps - only run once

  return children;
};
