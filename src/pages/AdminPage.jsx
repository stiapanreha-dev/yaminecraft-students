import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserManager } from '@/components/admin/UserManager';
import { AchievementForm } from '@/components/admin/AchievementForm';
import { EventForm } from '@/components/admin/EventForm';
import { Users, Award, Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllUsers, updateUser, createAchievement, createEvent, deleteAchievement, deleteEvent, updateAchievement, updateEvent } from '@/services/firestore';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { toast } from 'sonner';

export const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'achievements'));
      const achievementsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchUsers();
    fetchAchievements();
    fetchEvents();
  }, [authLoading, user?.uid, user?.role, fetchUsers, fetchAchievements, fetchEvents, navigate]);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      toast.success('Роль пользователя успешно изменена');
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Ошибка изменения роли');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCreateAchievement = async (data) => {
    try {
      setSubmitLoading(true);

      if (editingAchievement) {
        // Обновляем существующее достижение
        await updateAchievement(editingAchievement.id, data);
        toast.success('Достижение успешно обновлено');
      } else {
        // Создаем новое достижение
        await createAchievement(data);

      // Обновляем рейтинг пользователя
      const { getRatingByUserId, updateRating } = await import('@/services/firestore');
      const currentRating = await getRatingByUserId(data.userId);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const achievementDate = new Date(data.date);
      const achievementYear = achievementDate.getFullYear();
      const achievementMonth = achievementDate.getMonth();

      const newRating = {
        userId: data.userId,
        totalPoints: (currentRating?.totalPoints || 0) + data.points,
        yearPoints: achievementYear === currentYear
          ? (currentRating?.yearPoints || 0) + data.points
          : (currentRating?.yearPoints || 0),
        monthPoints: achievementYear === currentYear && achievementMonth === currentMonth
          ? (currentRating?.monthPoints || 0) + data.points
          : (currentRating?.monthPoints || 0),
        breakdown: {
          sport: (currentRating?.breakdown?.sport || 0) + (data.category === 'sport' ? data.points : 0),
          study: (currentRating?.breakdown?.study || 0) + (data.category === 'study' ? data.points : 0),
          creativity: (currentRating?.breakdown?.creativity || 0) + (data.category === 'creativity' ? data.points : 0),
          volunteer: (currentRating?.breakdown?.volunteer || 0) + (data.category === 'volunteer' ? data.points : 0),
        }
      };

        await updateRating(data.userId, newRating);

        toast.success('Достижение успешно создано');
      }

      setAchievementDialogOpen(false);
      setEditingAchievement(null);
      fetchAchievements(); // Обновляем список
    } catch (error) {
      console.error('Error with achievement:', error);
      toast.error(editingAchievement ? 'Ошибка обновления достижения' : 'Ошибка создания достижения');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (!confirm('Вы уверены что хотите удалить это достижение?')) return;

    try {
      await deleteAchievement(achievementId);
      toast.success('Достижение удалено');
      fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Ошибка удаления достижения');
    }
  };

  const handleEditAchievement = (achievement) => {
    // Преобразуем данные для формы
    const formData = {
      ...achievement,
      date: achievement.date?.toDate ? achievement.date.toDate() : new Date(achievement.date)
    };
    setEditingAchievement(formData);
    setAchievementDialogOpen(true);
  };

  const handleCreateEvent = async (data) => {
    try {
      setSubmitLoading(true);

      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
        toast.success('Мероприятие успешно обновлено');
      } else {
        await createEvent(data);
        toast.success('Мероприятие успешно создано');
      }

      setEventDialogOpen(false);
      setEditingEvent(null);
      fetchEvents(); // Обновляем список
    } catch (error) {
      console.error('Error with event:', error);
      toast.error(editingEvent ? 'Ошибка обновления мероприятия' : 'Ошибка создания мероприятия');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Вы уверены что хотите удалить это мероприятие?')) return;

    try {
      await deleteEvent(eventId);
      toast.success('Мероприятие удалено');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Ошибка удаления мероприятия');
    }
  };

  const handleEditEvent = (event) => {
    // Преобразуем данные для формы
    const formData = {
      ...event,
      date: event.date?.toDate ? event.date.toDate() : new Date(event.date)
    };
    setEditingEvent(formData);
    setEventDialogOpen(true);
  };

  console.log('AdminPage render:', { authLoading, user, userRole: user?.role });

  if (authLoading) {
    console.log('Showing loading state');
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!user || user.role !== 'admin') {
    console.log('Not admin, returning null');
    return null;
  }

  console.log('Rendering admin panel content');
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Админ-панель</h1>
          <p className="text-muted-foreground">
            Управление пользователями, достижениями и мероприятиями
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Учеников</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'student').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Администраторов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Достижения
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Мероприятия
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManager
                users={users}
                onChangeRole={handleChangeRole}
                onViewProfile={handleViewProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAchievementDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить достижение
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Управление достижениями ({achievements.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Нет созданных достижений
                </p>
              ) : (
                <div className="space-y-4">
                  {achievements.map((achievement) => {
                    const student = users.find(u => u.uid === achievement.userId);
                    return (
                      <div key={achievement.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span>Ученик: {student ? `${student.profile?.firstName} ${student.profile?.lastName}` : 'Не указан'}</span>
                              <span>•</span>
                              <span>Категория: {achievement.category}</span>
                              <span>•</span>
                              <span>Баллы: {achievement.points}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAchievement(achievement)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAchievement(achievement.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEventDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить мероприятие
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Управление мероприятиями ({events.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Нет созданных мероприятий
                </p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>Место: {event.location}</span>
                            <span>•</span>
                            <span>Дата: {event.date?.toDate?.().toLocaleDateString('ru-RU') || 'Не указана'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Dialog */}
      <Dialog open={achievementDialogOpen} onOpenChange={(open) => {
        setAchievementDialogOpen(open);
        if (!open) setEditingAchievement(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAchievement ? 'Редактировать достижение' : 'Добавить достижение'}</DialogTitle>
          </DialogHeader>
          <AchievementForm
            students={users}
            initialData={editingAchievement}
            onSubmit={handleCreateAchievement}
            onCancel={() => {
              setAchievementDialogOpen(false);
              setEditingAchievement(null);
            }}
            loading={submitLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={(open) => {
        setEventDialogOpen(open);
        if (!open) setEditingEvent(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Редактировать мероприятие' : 'Добавить мероприятие'}</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent}
            onSubmit={handleCreateEvent}
            onCancel={() => {
              setEventDialogOpen(false);
              setEditingEvent(null);
            }}
            loading={submitLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
