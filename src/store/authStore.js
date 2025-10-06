import { create } from 'zustand';
import { onAuthChange } from '../services/auth';
import { getUser } from '../services/firestore';

const useAuthStore = create((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initAuth: () => {
    onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const { user: profile, error } = await getUser(firebaseUser.uid);
        set({
          user: firebaseUser,
          userProfile: profile,
          loading: false,
          error: error,
        });
      } else {
        set({
          user: null,
          userProfile: null,
          loading: false,
          error: null,
        });
      }
    });
  },

  clearAuth: () => set({
    user: null,
    userProfile: null,
    loading: false,
    error: null,
  }),
}));

export default useAuthStore;
