import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Users, TrendingUp } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { StudentCard } from '@/components/student/StudentCard';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

export const HomePage = () => {
  const { students, loading } = useStudents({ limitCount: 6 });
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    achievements: 0,
    events: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Считаем только учеников (не админов)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const studentsCount = usersSnapshot.docs.filter(doc => doc.data().role === 'student').length;

        // Считаем достижения
        const achievementsSnapshot = await getDocs(collection(db, 'achievements'));
        const achievementsCount = achievementsSnapshot.size;

        // Считаем мероприятия
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventsCount = eventsSnapshot.size;

        setStats({
          students: studentsCount,
          achievements: achievementsCount,
          events: eventsCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
  const features = [
    {
      icon: Trophy,
      title: 'Рейтинг достижений',
      description: 'Следите за успехами учеников и мотивируйте их к новым свершениям',
      link: '/rating'
    },
    {
      icon: Calendar,
      title: 'Мероприятия',
      description: 'Узнавайте о предстоящих событиях и участвуйте в школьной жизни',
      link: '/events'
    },
    {
      icon: Users,
      title: 'Профили учеников',
      description: 'Подробная информация о каждом ученике и его достижениях',
      link: '/rating'
    },
    {
      icon: TrendingUp,
      title: 'Статистика',
      description: 'Анализируйте прогресс по категориям и периодам времени',
      link: '/rating'
    },
  ];

  const statsDisplay = [
    { label: 'Учеников', value: stats.students },
    { label: 'Достижений', value: stats.achievements },
    { label: 'Мероприятий', value: stats.events },
    { label: 'Категорий', value: 4 },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Анкеты учеников
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Платформа для отслеживания достижений и мотивации учеников к развитию
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/rating">
            <Button size="lg">
              Посмотреть рейтинг
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">
              Узнать больше
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Возможности платформы</h2>
          <p className="text-muted-foreground">
            Всё необходимое для мотивации и развития учеников
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="ghost" size="sm">
                      Подробнее →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Students Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Наши ученики</h2>
          <p className="text-muted-foreground">
            Познакомьтесь с участниками платформы
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-48" />
              </Card>
            ))}
          </div>
        ) : students.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
            <div className="text-center">
              <Link to="/rating">
                <Button variant="outline" size="lg">
                  Посмотреть всех учеников →
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Пока нет зарегистрированных учеников
            </p>
            {!isAuthenticated && (
              <Link to="/login">
                <Button className="mt-4">
                  Зарегистрироваться
                </Button>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-primary/5 rounded-lg p-8 md:p-12 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Готовы начать?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Присоединяйтесь к нашей платформе и начните отслеживать достижения учеников
          </p>
          <Link to="/login">
            <Button size="lg" className="mt-4">
              Войти в систему
            </Button>
          </Link>
        </section>
      )}
    </div>
  );
};
