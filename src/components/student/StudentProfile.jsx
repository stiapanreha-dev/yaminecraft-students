import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Calendar,
  User,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { formatDateLong, calculateAge } from '@/utils/dateFormatter';
import { useUserRating } from '@/hooks/useRating';
import { RATING_PERIODS } from '@/hooks/useRating';

/**
 * Детальный профиль ученика
 * @param {Object} student - данные ученика
 * @param {Array} achievements - список достижений
 */
export const StudentProfile = ({ student, achievements = [] }) => {
  if (!student) return null;

  const { profile, uid, email } = student;
  const { rating, getPointsByPeriod, getPointsByCategory } = useUserRating(uid);

  const fullName = `${profile.firstName} ${profile.lastName} ${profile.middleName || ''}`;
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();
  const age = profile.birthDate ? calculateAge(profile.birthDate) : null;

  const categories = [
    { key: 'sport', label: 'Спорт', icon: Trophy, color: 'text-blue-500' },
    { key: 'study', label: 'Учёба', icon: Target, color: 'text-green-500' },
    { key: 'creativity', label: 'Творчество', icon: Award, color: 'text-purple-500' },
    { key: 'volunteer', label: 'Волонтёрство', icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.photoUrl} alt={fullName} />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{fullName}</h1>
                <p className="text-muted-foreground">{email}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {profile.class && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    <span>{profile.class} класс</span>
                  </div>
                )}
                {age && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{age} лет</span>
                  </div>
                )}
                {profile.birthDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Дата рождения: {formatDateLong(profile.birthDate)}</span>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего баллов</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getPointsByPeriod(RATING_PERIODS.ALL_TIME)}
            </div>
            <p className="text-xs text-muted-foreground">За всё время</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">За год</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getPointsByPeriod(RATING_PERIODS.YEAR)}
            </div>
            <p className="text-xs text-muted-foreground">Текущий год</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">За месяц</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getPointsByPeriod(RATING_PERIODS.MONTH)}
            </div>
            <p className="text-xs text-muted-foreground">Текущий месяц</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Распределение по категориям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const points = getPointsByCategory(category.key);
              return (
                <div key={category.key} className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                  <Icon className={`h-8 w-8 ${category.color}`} />
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className="text-2xl font-bold">{points}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Достижения ({achievements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">Все</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.key} value={category.key}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {achievements.map((achievement, index) => (
                  <div key={achievement.id}>
                    <div className="flex items-start space-x-4">
                      <Badge variant="outline" className="mt-1">
                        +{achievement.points}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateLong(achievement.date)}
                        </p>
                      </div>
                    </div>
                    {index < achievements.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </TabsContent>

              {categories.map((category) => {
                const filteredAchievements = achievements.filter(
                  (a) => a.category === category.key
                );
                return (
                  <TabsContent key={category.key} value={category.key} className="space-y-4 mt-4">
                    {filteredAchievements.length > 0 ? (
                      filteredAchievements.map((achievement, index) => (
                        <div key={achievement.id}>
                          <div className="flex items-start space-x-4">
                            <Badge variant="outline" className="mt-1">
                              +{achievement.points}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDateLong(achievement.date)}
                              </p>
                            </div>
                          </div>
                          {index < filteredAchievements.length - 1 && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Нет достижений в этой категории
                      </p>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Пока нет достижений
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
