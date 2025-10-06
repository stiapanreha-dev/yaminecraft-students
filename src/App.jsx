import { useEffect } from 'react';
import useAuthStore from './store/authStore';

function App() {
  const { user, userProfile, loading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Анкеты учеников
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-4">
                Добро пожаловать!
              </h2>
              {user ? (
                <div>
                  <p className="text-gray-700">
                    Вы вошли как: <strong>{user.email}</strong>
                  </p>
                  {userProfile && (
                    <p className="text-gray-600 mt-2">
                      Роль: <span className="capitalize">{userProfile.role}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-700">
                  Проект успешно инициализирован!
                </p>
              )}
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  React + Vite + Tailwind CSS + Firebase + MinIO
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
