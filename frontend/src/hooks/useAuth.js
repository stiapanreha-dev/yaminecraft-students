import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      const { accessToken, user: userData } = response.data;

      localStorage.setItem('token', accessToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, profileData) => {
    try {
      setLoading(true);
      const registerData = {
        email,
        password,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        middleName: profileData.middleName,
        bio: profileData.bio,
        role: profileData.role,
      };

      // Only include birthDate if it's set
      if (profileData.birthDate) {
        registerData.birthDate = profileData.birthDate;
      }

      const response = await authApi.register(registerData);

      const { accessToken, user: userData } = response.data;

      localStorage.setItem('token', accessToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    return { success: true };
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isStudent = () => {
    return user?.role === 'STUDENT';
  };

  const isTeacher = () => {
    return user?.role === 'TEACHER';
  };

  const isTeacherOrAdmin = () => {
    return user?.role === 'TEACHER' || user?.role === 'ADMIN';
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isStudent,
    isTeacher,
    isTeacherOrAdmin,
    isAuthenticated: !!user
  };
};
