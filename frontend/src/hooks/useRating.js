import { useState, useEffect, useCallback } from 'react';
import { ratingsApi } from '@/services/api';

export const RATING_PERIODS = {
  ALL_TIME: 'all',
  YEAR: 'year',
  MONTH: 'month'
};

export const useRating = (options = {}) => {
  const {
    period = RATING_PERIODS.ALL_TIME,
    category = null,
    limitCount = 100
  } = options;

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRating = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ratingsApi.getAll(period, limitCount);
      let ratingsList = response.data;

      if (category && category !== 'all') {
        const categoryField = `${category}Points`;
        ratingsList = ratingsList.map(rating => ({
          ...rating,
          points: rating[categoryField] || 0
        })).sort((a, b) => b.points - a.points);
      }

      setRatings(ratingsList);
    } catch (err) {
      console.error('Error fetching rating:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period, category, limitCount]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const getUserRank = useCallback((userId) => {
    const index = ratings.findIndex(rating => rating.userId === userId);
    return index !== -1 ? index + 1 : null;
  }, [ratings]);

  const getTopRatings = useCallback((count = 10) => {
    return ratings.slice(0, count);
  }, [ratings]);

  const getCategoryStats = useCallback((userId) => {
    const userRating = ratings.find(r => r.userId === userId);
    return {
      sport: userRating?.sportPoints || 0,
      study: userRating?.studyPoints || 0,
      creativity: userRating?.creativityPoints || 0,
      volunteer: userRating?.volunteerPoints || 0
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
        const response = await ratingsApi.getByUserId(userId);
        setRating(response.data);
      } catch (err) {
        console.error('Error fetching user rating:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRating();
  }, [userId]);

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

  const getPointsByCategory = useCallback((category) => {
    const field = `${category}Points`;
    return rating?.[field] || 0;
  }, [rating]);

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
