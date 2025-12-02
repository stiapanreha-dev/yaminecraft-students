import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => {
    console.log('authStore: setUser called', { user: !!user, role: user?.role });
    set({ user });
  },
  setLoading: (loading) => {
    console.log('authStore: setLoading called', { loading });
    set({ loading });
  },
  setError: (error) => set({ error }),

  clearAuth: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      loading: false,
      error: null,
    });
  },
}));

export default useAuthStore;
export { useAuthStore };
