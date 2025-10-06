import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getUserById, updateUser } from '@/services/firestore';

/**
 * Hook для работы со списком учеников
 * @param {Object} options - параметры фильтрации и сортировки
 * @returns {Object} - данные учеников и методы управления
 */
export const useStudents = (options = {}) => {
  const {
    filterClass = null,
    sortBy = 'profile.lastName',
    limitCount = 50,
    realtime = false
  } = options;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Получение списка учеников
   */
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );

      // Фильтр по классу
      if (filterClass) {
        q = query(q, where('profile.class', '==', filterClass));
      }

      // Сортировка
      if (sortBy) {
        q = query(q, orderBy(sortBy));
      }

      // Лимит
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      const studentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStudents(studentsList);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterClass, sortBy, limitCount]);

  useEffect(() => {
    if (realtime) {
      // Подписка на изменения в реальном времени
      let q = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );

      if (filterClass) {
        q = query(q, where('profile.class', '==', filterClass));
      }

      if (sortBy) {
        q = query(q, orderBy(sortBy));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const studentsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setStudents(studentsList);
          setLoading(false);
        },
        (err) => {
          console.error('Error in students snapshot:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      fetchStudents();
    }
  }, [fetchStudents, realtime, filterClass, sortBy, limitCount]);

  /**
   * Обновление данных ученика
   */
  const updateStudent = async (studentId, data) => {
    try {
      await updateUser(studentId, data);
      // Обновляем локальное состояние
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? { ...student, ...data }
            : student
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error updating student:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Получение одного ученика по ID
   */
  const getStudent = async (studentId) => {
    try {
      const student = await getUserById(studentId);
      return { success: true, student };
    } catch (err) {
      console.error('Error fetching student:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Поиск учеников по имени
   */
  const searchStudents = useCallback((searchTerm) => {
    if (!searchTerm) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(student => {
      const fullName = `${student.profile.firstName} ${student.profile.lastName} ${student.profile.middleName || ''}`.toLowerCase();
      return fullName.includes(term);
    });
  }, [students]);

  /**
   * Группировка учеников по классам
   */
  const groupByClass = useCallback(() => {
    return students.reduce((acc, student) => {
      const className = student.profile.class || 'Без класса';
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {});
  }, [students]);

  return {
    students,
    loading,
    error,
    updateStudent,
    getStudent,
    searchStudents,
    groupByClass,
    refetch: fetchStudents
  };
};

/**
 * Hook для работы с одним учеником
 * @param {string} studentId - ID ученика
 * @returns {Object} - данные ученика и методы
 */
export const useStudent = (studentId) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserById(studentId);
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const updateStudent = async (data) => {
    try {
      await updateUser(studentId, data);
      setStudent(prev => ({ ...prev, ...data }));
      return { success: true };
    } catch (err) {
      console.error('Error updating student:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    student,
    loading,
    error,
    updateStudent
  };
};
