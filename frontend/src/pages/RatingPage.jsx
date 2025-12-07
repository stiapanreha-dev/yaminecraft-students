import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { RatingTable } from '@/components/rating/RatingTable';
import { RatingFilters } from '@/components/rating/RatingFilters';
import { useRating, RATING_PERIODS } from '@/hooks/useRating';
import { useStudents } from '@/hooks/useStudents';
import { usersApi } from '@/services/api';

export const RatingPage = () => {
  const [period, setPeriod] = useState(RATING_PERIODS.ALL_TIME);
  const [category, setCategory] = useState('all');
  const [students, setStudents] = useState({});

  const { ratings, loading: ratingsLoading, error } = useRating({
    period,
    category,
    limitCount: 100,
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
              const response = await usersApi.getById(rating.userId);
              studentsData[rating.userId] = response.data;
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
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="display-6 fw-bold mb-2">Рейтинг учеников</h1>
          <p>
            Топ учеников по достижениям и баллам
          </p>
        </div>
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
        <Alert variant="danger">
          Ошибка загрузки рейтинга: {error}
        </Alert>
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
