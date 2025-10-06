import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, Users, Heart } from 'lucide-react';

export const AboutPage = () => {
  const goals = [
    {
      icon: Trophy,
      title: 'Мотивация к развитию',
      description: 'Система рейтинга побуждает учеников достигать новых высот и стремиться к совершенству'
    },
    {
      icon: Target,
      title: 'Объективная оценка',
      description: 'Прозрачная система подсчёта баллов по различным категориям достижений'
    },
    {
      icon: Users,
      title: 'Здоровая конкуренция',
      description: 'Соревновательный дух в позитивной и поддерживающей атмосфере'
    },
    {
      icon: Heart,
      title: 'Признание заслуг',
      description: 'Каждое достижение ученика фиксируется и получает заслуженное признание'
    },
  ];

  const categories = [
    {
      name: 'Спорт',
      description: 'Достижения в спортивных соревнованиях, олимпиадах, турнирах',
      examples: ['Победа в соревнованиях', 'Участие в спартакиаде', 'Спортивные рекорды']
    },
    {
      name: 'Учёба',
      description: 'Академические успехи, участие в олимпиадах, научные проекты',
      examples: ['Победа в олимпиаде', 'Отличная успеваемость', 'Научные исследования']
    },
    {
      name: 'Творчество',
      description: 'Достижения в искусстве, музыке, театре и других творческих направлениях',
      examples: ['Победа в конкурсе', 'Выставки работ', 'Концертные выступления']
    },
    {
      name: 'Волонтёрство',
      description: 'Социальная активность, помощь другим, организация мероприятий',
      examples: ['Благотворительные акции', 'Помощь младшим', 'Организация событий']
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">О проекте</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Платформа для отслеживания и поощрения достижений учеников
        </p>
      </section>

      {/* Mission */}
      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Наша миссия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Мы создали эту платформу, чтобы помочь ученикам раскрыть свой потенциал и достичь новых высот.
              Наша цель — мотивировать учеников к развитию, признавать их заслуги и создавать здоровую
              конкурентную среду.
            </p>
            <p className="text-muted-foreground">
              Система рейтинга позволяет объективно оценивать достижения в различных сферах деятельности:
              спорте, учёбе, творчестве и волонтёрстве. Каждый успех ученика фиксируется и получает
              заслуженное признание.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Goals */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Наши цели</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{goal.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{goal.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Categories */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Категории достижений</h2>
        <div className="space-y-6">
          {categories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{category.description}</p>
                <div>
                  <p className="text-sm font-medium mb-2">Примеры:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {category.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Как это работает</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Регистрация достижения</h3>
              <p className="text-muted-foreground">
                Администраторы добавляют достижения учеников в систему с указанием категории,
                описания и количества баллов.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">2. Подсчёт баллов</h3>
              <p className="text-muted-foreground">
                Система автоматически подсчитывает баллы по различным периодам (всё время, год, месяц)
                и категориям.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">3. Формирование рейтинга</h3>
              <p className="text-muted-foreground">
                На основе набранных баллов формируется рейтинг учеников, который можно фильтровать
                по периодам и категориям.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">4. Мотивация к развитию</h3>
              <p className="text-muted-foreground">
                Ученики видят свои достижения, сравнивают результаты с другими и стремятся
                улучшить свои показатели.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
