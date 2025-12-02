import { Card, Row, Col } from 'react-bootstrap';
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
    <div className="d-flex flex-column gap-5 py-4">
      {/* Header */}
      <section className="text-center">
        <h1 className="display-5 fw-bold mb-3">О проекте</h1>
        <p className="lead text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Платформа для отслеживания и поощрения достижений учеников
        </p>
      </section>

      {/* Mission */}
      <section>
        <Card>
          <Card.Header>
            <h2 className="h4 mb-0">Наша миссия</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-secondary mb-3">
              Мы создали эту платформу, чтобы помочь ученикам раскрыть свой потенциал и достичь новых высот.
              Наша цель — мотивировать учеников к развитию, признавать их заслуги и создавать здоровую
              конкурентную среду.
            </p>
            <p className="text-secondary mb-0">
              Система рейтинга позволяет объективно оценивать достижения в различных сферах деятельности:
              спорте, учёбе, творчестве и волонтёрстве. Каждый успех ученика фиксируется и получает
              заслуженное признание.
            </p>
          </Card.Body>
        </Card>
      </section>

      {/* Goals */}
      <section>
        <h2 className="h3 fw-bold text-center mb-4">Наши цели</h2>
        <Row className="g-4">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <Col key={index} xs={12} md={6}>
                <Card className="h-100">
                  <Card.Header className="bg-white border-0 pt-4 pb-0">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)'
                        }}
                      >
                        <Icon style={{ width: '24px', height: '24px' }} className="text-primary" />
                      </div>
                      <h5 className="mb-0 fw-semibold">{goal.title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-secondary mb-0">{goal.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>

      <hr />

      {/* Categories */}
      <section>
        <h2 className="h3 fw-bold text-center mb-4">Категории достижений</h2>
        <div className="d-flex flex-column gap-3">
          {categories.map((category, index) => (
            <Card key={index}>
              <Card.Header>
                <h5 className="mb-0">{category.name}</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-secondary mb-3">{category.description}</p>
                <div>
                  <p className="small fw-medium mb-2">Примеры:</p>
                  <ul className="mb-0 ps-3">
                    {category.examples.map((example, i) => (
                      <li key={i} className="text-secondary small">{example}</li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      <hr />

      {/* How it works */}
      <section>
        <h2 className="h3 fw-bold text-center mb-4">Как это работает</h2>
        <Card>
          <Card.Body>
            <div className="mb-4">
              <h5 className="fw-semibold mb-2">1. Регистрация достижения</h5>
              <p className="text-secondary mb-0">
                Администраторы добавляют достижения учеников в систему с указанием категории,
                описания и количества баллов.
              </p>
            </div>
            <hr />
            <div className="mb-4">
              <h5 className="fw-semibold mb-2">2. Подсчёт баллов</h5>
              <p className="text-secondary mb-0">
                Система автоматически подсчитывает баллы по различным периодам (всё время, год, месяц)
                и категориям.
              </p>
            </div>
            <hr />
            <div className="mb-4">
              <h5 className="fw-semibold mb-2">3. Формирование рейтинга</h5>
              <p className="text-secondary mb-0">
                На основе набранных баллов формируется рейтинг учеников, который можно фильтровать
                по периодам и категориям.
              </p>
            </div>
            <hr />
            <div>
              <h5 className="fw-semibold mb-2">4. Мотивация к развитию</h5>
              <p className="text-secondary mb-0">
                Ученики видят свои достижения, сравнивают результаты с другими и стремятся
                улучшить свои показатели.
              </p>
            </div>
          </Card.Body>
        </Card>
      </section>
    </div>
  );
};
