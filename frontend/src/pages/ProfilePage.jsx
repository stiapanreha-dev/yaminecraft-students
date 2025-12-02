import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { StudentProfile } from '@/components/student/StudentProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { usersApi, achievementsApi } from '@/services/api';

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

      console.log('Fetching profile for userId:', userId);

      // Загружаем данные ученика и его достижения параллельно
      const [studentResponse, achievementsResponse] = await Promise.all([
        usersApi.getById(userId),
        achievementsApi.getByUserId(userId)
      ]);

      console.log('Student data:', studentResponse.data);
      console.log('Achievements data:', achievementsResponse.data);

      setStudent(studentResponse.data);
      setAchievements(achievementsResponse.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      console.error('Error details:', err.message);
      setError(`Не удалось загрузить профиль ученика: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column gap-4 py-4">
        <Skeleton style={{ height: '192px', width: '100%' }} />
        <Row className="g-4">
          <Col xs={12} md={4}>
            <Skeleton style={{ height: '128px', width: '100%' }} />
          </Col>
          <Col xs={12} md={4}>
            <Skeleton style={{ height: '128px', width: '100%' }} />
          </Col>
          <Col xs={12} md={4}>
            <Skeleton style={{ height: '128px', width: '100%' }} />
          </Col>
        </Row>
        <Skeleton style={{ height: '256px', width: '100%' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="h5 fw-medium text-danger mb-2">Ошибка</p>
        <p className="text-secondary">{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-5">
        <p className="h5 fw-medium mb-2">Ученик не найден</p>
        <p className="text-secondary">
          Пользователь с ID {userId} не существует
        </p>
      </div>
    );
  }

  return <StudentProfile student={student} achievements={achievements} onUpdate={fetchData} />;
};
