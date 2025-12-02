import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '@/services/api';

export const useStudents = (options = {}) => {
  const { filterClass = null, limitCount = 50 } = options;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersApi.getStudents();
      let studentsList = response.data;

      if (filterClass) {
        studentsList = studentsList.filter(s => s.class === filterClass);
      }

      if (limitCount) {
        studentsList = studentsList.slice(0, limitCount);
      }

      setStudents(studentsList);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterClass, limitCount]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updateStudent = async (studentId, data) => {
    try {
      await usersApi.update(studentId, data);
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, ...data } : student
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error updating student:', err);
      return { success: false, error: err.message };
    }
  };

  const getStudent = async (studentId) => {
    try {
      const response = await usersApi.getById(studentId);
      return { success: true, student: response.data };
    } catch (err) {
      console.error('Error fetching student:', err);
      return { success: false, error: err.message };
    }
  };

  const searchStudents = useCallback((searchTerm) => {
    if (!searchTerm) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(student => {
      const fullName = `${student.firstName} ${student.lastName} ${student.middleName || ''}`.toLowerCase();
      return fullName.includes(term);
    });
  }, [students]);

  const groupByClass = useCallback(() => {
    return students.reduce((acc, student) => {
      const className = student.class || 'Без класса';
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
        const response = await usersApi.getById(studentId);
        setStudent(response.data);
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
      await usersApi.update(studentId, data);
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
