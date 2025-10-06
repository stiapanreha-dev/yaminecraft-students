import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudentProfile } from '@/components/student/StudentProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserById, getAchievementsByUserId } from '@/services/firestore';

export const ProfilePage = () => {
  const { userId } = useParams();
  const [student, setStudent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Загружаем данные ученика и его достижения параллельно
      const [studentData, achievementsData] = await Promise.all([
        getUserById(userId),
        getAchievementsByUserId(userId)
      ]);

      setStudent(studentData);
      setAchievements(achievementsData);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Не удалось загрузить профиль ученика');
    } finally {
      setLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-destructive mb-2">Ошибка</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium mb-2">Ученик не найден</p>
        <p className="text-muted-foreground">
          Пользователь с ID {userId} не существует
        </p>
      </div>
    );
  }

  return <StudentProfile student={student} achievements={achievements} />;
};
