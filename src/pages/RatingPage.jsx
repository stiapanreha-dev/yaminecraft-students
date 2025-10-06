import { useState, useEffect } from 'react';
import { RatingTable } from '@/components/rating/RatingTable';
import { RatingFilters } from '@/components/rating/RatingFilters';
import { useRating, RATING_PERIODS } from '@/hooks/useRating';
import { useStudents } from '@/hooks/useStudents';
import { getUserById } from '@/services/firestore';

export const RatingPage = () => {
  const [period, setPeriod] = useState(RATING_PERIODS.ALL_TIME);
  const [category, setCategory] = useState('all');
  const [students, setStudents] = useState({});

  const { ratings, loading: ratingsLoading, error } = useRating({
    period,
    category,
    limitCount: 100,
    realtime: false
  });

  const { students: allStudents, loading: studentsLoading } = useStudents();

  // Создаем рейтинги из учеников если нет ratings
  const displayRatings = ratings.length > 0 ? ratings : allStudents.map(student => ({
    userId: student.id,
    totalPoints: 0,
    monthPoints: 0,
    yearPoints: 0,
    breakdown: {
      sport: 0,
      study: 0,
      creativity: 0,
      volunteer: 0
    }
  }));

  // Загружаем данные учеников для отображения в таблице
  useEffect(() => {
    const fetchStudents = async () => {
      const studentsData = {};

      // Если есть ratings, загружаем учеников по ним
      if (ratings.length > 0) {
        for (const rating of ratings) {
          if (!studentsData[rating.userId]) {
            try {
              const student = await getUserById(rating.userId);
              studentsData[rating.userId] = student;
            } catch (err) {
              console.error(`Error fetching student ${rating.userId}:`, err);
            }
          }
        }
      } else {
        // Иначе используем всех учеников
        allStudents.forEach(student => {
          studentsData[student.id] = student;
        });
      }

      setStudents(studentsData);
    };

    if (ratings.length > 0 || allStudents.length > 0) {
      fetchStudents();
    }
  }, [ratings, allStudents]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Рейтинг учеников</h1>
        <p className="text-muted-foreground">
          Топ учеников по достижениям и баллам
        </p>
      </div>

      {/* Filters */}
      <RatingFilters
        period={period}
        onPeriodChange={handlePeriodChange}
        category={category}
        onCategoryChange={handleCategoryChange}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Ошибка загрузки рейтинга: {error}
        </div>
      )}

      {/* Rating Table */}
      <RatingTable
        ratings={displayRatings}
        loading={ratingsLoading || studentsLoading}
        students={students}
      />
    </div>
  );
};
