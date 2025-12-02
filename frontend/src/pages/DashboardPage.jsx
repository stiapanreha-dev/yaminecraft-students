import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { StudentProfile } from '@/components/student/StudentProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { achievementsApi } from '@/services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementsApi.getByUserId(user.id);
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-5">
        <p className="h5 fw-medium mb-2">Требуется авторизация</p>
        <p className="text-secondary">
          Пожалуйста, войдите в систему, чтобы увидеть личный кабинет
        </p>
      </div>
    );
  }

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

  return (
    <div className="d-flex flex-column gap-4 py-4">
      <div>
        <h1 className="display-6 fw-bold mb-2">Личный кабинет</h1>
        <p className="text-secondary">
          Ваш профиль и достижения
        </p>
      </div>

      <StudentProfile student={user} achievements={achievements} />
    </div>
  );
};
