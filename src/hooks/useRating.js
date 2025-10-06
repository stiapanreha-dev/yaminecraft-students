import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getRatingByUserId } from '@/services/firestore';

/**
 * Периоды для фильтрации рейтинга
 */
export const RATING_PERIODS = {
  ALL_TIME: 'allTime',
  YEAR: 'year',
  MONTH: 'month'
};

/**
 * Hook для работы с рейтинговой таблицей
 * @param {Object} options - параметры фильтрации
 * @returns {Object} - рейтинговые данные и методы
 */
export const useRating = (options = {}) => {
  const {
    period = RATING_PERIODS.ALL_TIME,
    category = null,
    limitCount = 100,
    realtime = false
  } = options;

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Определяем поле для сортировки в зависимости от периода
   */
  const getSortField = useCallback(() => {
    switch (period) {
      case RATING_PERIODS.MONTH:
        return 'monthPoints';
      case RATING_PERIODS.YEAR:
        return 'yearPoints';
      case RATING_PERIODS.ALL_TIME:
      default:
        return 'totalPoints';
    }
  }, [period]);

  /**
   * Получение рейтинга
   */
  const fetchRating = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const sortField = getSortField();

      let q = query(
        collection(db, 'ratings'),
        orderBy(sortField, 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      let ratingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Фильтрация по категории (если указана)
      if (category && category !== 'all') {
        ratingsList = ratingsList.map(rating => ({
          ...rating,
          points: rating.breakdown?.[category] || 0
        })).sort((a, b) => b.points - a.points);
      }

      setRatings(ratingsList);
    } catch (err) {
      console.error('Error fetching rating:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period, category, limitCount, getSortField]);

  useEffect(() => {
    if (realtime) {
      // Подписка на изменения в реальном времени
      const sortField = getSortField();

      let q = query(
        collection(db, 'ratings'),
        orderBy(sortField, 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let ratingsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Фильтрация по категории
          if (category && category !== 'all') {
            ratingsList = ratingsList.map(rating => ({
              ...rating,
              points: rating.breakdown?.[category] || 0
            })).sort((a, b) => b.points - a.points);
          }

          setRatings(ratingsList);
          setLoading(false);
        },
        (err) => {
          console.error('Error in rating snapshot:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      fetchRating();
    }
  }, [fetchRating, realtime, getSortField, category, limitCount]);

  /**
   * Получение позиции конкретного пользователя в рейтинге
   */
  const getUserRank = useCallback((userId) => {
    const index = ratings.findIndex(rating => rating.userId === userId);
    return index !== -1 ? index + 1 : null;
  }, [ratings]);

  /**
   * Получение топ N пользователей
   */
  const getTopRatings = useCallback((count = 10) => {
    return ratings.slice(0, count);
  }, [ratings]);

  /**
   * Статистика по категориям для конкретного пользователя
   */
  const getCategoryStats = useCallback((userId) => {
    const userRating = ratings.find(r => r.userId === userId);
    return userRating?.breakdown || {
      sport: 0,
      study: 0,
      creativity: 0,
      volunteer: 0
    };
  }, [ratings]);

  return {
    ratings,
    loading,
    error,
    getUserRank,
    getTopRatings,
    getCategoryStats,
    refetch: fetchRating
  };
};

/**
 * Hook для работы с рейтингом конкретного пользователя
 * @param {string} userId - ID пользователя
 * @returns {Object} - рейтинговые данные пользователя
 */
export const useUserRating = (userId) => {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserRating = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRatingByUserId(userId);
        setRating(data);
      } catch (err) {
        console.error('Error fetching user rating:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRating();
  }, [userId]);

  /**
   * Получение баллов за определённый период
   */
  const getPointsByPeriod = useCallback((period) => {
    if (!rating) return 0;

    switch (period) {
      case RATING_PERIODS.MONTH:
        return rating.monthPoints || 0;
      case RATING_PERIODS.YEAR:
        return rating.yearPoints || 0;
      case RATING_PERIODS.ALL_TIME:
      default:
        return rating.totalPoints || 0;
    }
  }, [rating]);

  /**
   * Получение баллов по категории
   */
  const getPointsByCategory = useCallback((category) => {
    return rating?.breakdown?.[category] || 0;
  }, [rating]);

  /**
   * Общий процент от максимально возможных баллов
   * (предполагаем максимум 1000 баллов для расчёта прогресса)
   */
  const getProgressPercent = useCallback((maxPoints = 1000) => {
    if (!rating) return 0;
    return Math.min((rating.totalPoints / maxPoints) * 100, 100);
  }, [rating]);

  return {
    rating,
    loading,
    error,
    getPointsByPeriod,
    getPointsByCategory,
    getProgressPercent
  };
};
