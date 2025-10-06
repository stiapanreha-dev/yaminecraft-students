import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StudentProfile } from '@/components/student/StudentProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { getAchievementsByUserId } from '@/services/firestore';

/**
 * Личный кабинет ученика
 */
export const DashboardPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievementsByUserId(user.uid);
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium mb-2">Требуется авторизация</p>
        <p className="text-muted-foreground">
          Пожалуйста, войдите в систему, чтобы увидеть личный кабинет
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Личный кабинет</h1>
        <p className="text-muted-foreground">
          Ваш профиль и достижения
        </p>
      </div>

      <StudentProfile student={user} achievements={achievements} />
    </div>
  );
};
