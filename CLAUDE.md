# Yaminecraft - Анкеты учеников

Веб-приложение для размещения анкет учеников с системой рейтинга, достижений, домашних заданий и блога.

## Быстрый старт

```bash
./dev.sh           # Запуск backend + frontend
./stop.sh          # Остановка серверов
```

## URLs

### Production (сервер)

| Сервис | URL |
|--------|-----|
| Frontend | https://robosaratov.ru |
| Backend API | https://robosaratov.ru/api |
| MinIO Console | https://minio.robosaratov.ru |
| Admin | admin@example.com / admin123456 |
| MinIO | minioadmin / minioadmin123 |

### Development (локально)

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Admin | admin@local / admin123456 |

## Стек

**Backend:** NestJS + Prisma + PostgreSQL + MinIO (S3)
**Frontend:** React 19 + Vite + Bootstrap 5 + react-bootstrap

## Структура

```
yaminecraft/
├── backend/           # NestJS API
│   ├── prisma/        # Schema + migrations
│   └── src/           # Modules: auth, users, achievements, events, ratings, materials, uploads, homework, articles, projects, banners, pages
├── frontend/          # React SPA
│   └── src/
│       ├── components/  # UI, layout, admin, student, rating, events, homework
│       ├── pages/       # Страницы приложения
│       ├── hooks/       # useAuth, useStudents, useRating
│       └── services/    # API client (axios)
├── docs/              # Документация (подробная)
├── dev.sh             # Запуск dev серверов
└── stop.sh            # Остановка серверов
```

## Ключевые файлы

| Файл | Описание |
|------|----------|
| `backend/prisma/schema.prisma` | Модели БД |
| `backend/src/auth/*` | JWT авторизация |
| `backend/src/uploads/*` | Загрузка файлов (изображения, документы) |
| `backend/src/materials/*` | Материалы для педагогов |
| `backend/src/homework/*` | Домашние задания |
| `backend/src/articles/*` | Статьи блога |
| `backend/src/projects/*` | Проекты (категории блога) |
| `backend/src/banners/*` | Баннеры на главной |
| `backend/src/pages/*` | CMS страницы |
| `frontend/src/services/api.js` | API клиент |
| `frontend/src/App.jsx` | Роутинг |
| `frontend/src/store/authStore.js` | Zustand state |

## Документация

Подробная документация: `docs/README.md`

- [Архитектура](docs/architecture.md)
- [API Reference](docs/backend/api-reference.md)
- [Database Schema](docs/backend/database.md)
- [Authentication](docs/backend/authentication.md)
- [Components](docs/frontend/components.md)
- [Pages](docs/frontend/pages.md)
- [State Management](docs/frontend/state.md)
- [Setup](docs/development/setup.md)
- [Scripts](docs/development/scripts.md)

## Роли пользователей

| Роль | Описание | Доступ |
|------|----------|--------|
| `VISITOR` | Посетитель | Просмотр публичных страниц |
| `STUDENT` | Ученик | Просмотр, редактирование своего профиля, домашние задания |
| `PENDING_TEACHER` | Ожидающий педагог | Как VISITOR, ожидает одобрения админом |
| `TEACHER` | Педагог | Материалы для педагогов, создание ДЗ, управление мероприятиями |
| `ADMIN` | Администратор | Полный доступ, управление ролями всех пользователей |

### Система ролей при регистрации

При регистрации пользователь выбирает тип аккаунта:
- **Ученик** → роль `STUDENT`
- **Педагог** → роль `PENDING_TEACHER` (требует одобрения админом)
- **Посетитель** → роль `VISITOR`

Админ может изменить роль любого пользователя в любое время через админ-панель.

## Домашние задания

Раздел `/homework` для учеников, `/teacher/homework` для педагогов.

### Возможности

- Создание ДЗ с описанием, сроком сдачи и прикреплёнными файлами
- Назначение ДЗ всем ученикам или конкретным
- Сдача ДЗ учениками (текст или ссылка)
- Оценивание и комментарии от преподавателя
- Статусы: `PENDING`, `SUBMITTED`, `GRADED`, `RETURNED`

### Модели данных

- `Homework` - домашнее задание
- `HomeworkFile` - прикреплённые файлы к ДЗ
- `HomeworkAssignment` - назначение ДЗ конкретным ученикам (many-to-many)
- `HomeworkSubmission` - ответы учеников

## Материалы для педагогов

Раздел `/materials` доступен только для `TEACHER` и `ADMIN`.

### Категории материалов (MaterialCategory)

- `METHODOLOGY` - Методические материалы
- `LESSON_PLAN` - Планы уроков
- `PRESENTATION` - Презентации
- `WORKSHEET` - Рабочие листы
- `OTHER` - Другое

### Модели

- `Material` - материал с названием, описанием, категорией, счётчиком скачиваний
- `MaterialFile` - прикреплённые файлы (filename, fileUrl, fileSize, fileType)

### Загрузка файлов

- Поддержка множественных файлов на один материал
- Допустимые форматы: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, GIF, WebP
- Максимальный размер файла: 100 MB
- Drag & drop загрузка с прогрессом

## Блог (Проекты и Статьи)

Раздел `/blog` для публикации статей по проектам.

### Модели

- `Project` - проект (категория статей) с названием, цветом, описанием и изображением
- `Article` - статья с заголовком, slug, контентом, excerpt, изображением и флагом публикации

## CMS (Страницы и Баннеры)

### Page - статические страницы

Модель для CMS страниц (например, "О нас").

| Поле | Тип | Описание |
|------|-----|----------|
| `slug` | String | Уникальный идентификатор (например: `about`) |
| `title` | String | Заголовок страницы |
| `content` | String | HTML/текст контента |

### Banner - баннеры на главной

Управление hero-секцией на главной странице.

| Поле | Тип | Описание |
|------|-----|----------|
| `title` | String | Заголовок баннера |
| `subtitle` | String? | Подзаголовок |
| `imageUrl` | String? | URL фонового изображения |
| `backgroundColor` | String? | Цвет фона (по умолчанию #313642) |
| `buttonText` | String? | Текст кнопки |
| `buttonLink` | String? | Ссылка кнопки |
| `isActive` | Boolean | Активен ли баннер |
| `order` | Int | Порядок сортировки |

## Мероприятия

### Типы мероприятий (EventType)

- `MASTER_CLASS` - Мастер-класс (запись по телефону)
- `COMPETITION` - Соревнование
- `FREE_LESSON` - Открытый урок (запись по телефону)
- `WORKSHOP` - Воркшоп
- `OTHER` - Другое

### Уровни мероприятий (EventLevel)

- `SCHOOL` - Школьный
- `DISTRICT` - Районный
- `CITY` - Городской
- `REGIONAL` - Региональный
- `NATIONAL` - Национальный
- `INTERNATIONAL` - Международный

### Формат мероприятий (EventFormat)

- `OFFLINE` - Очно
- `ONLINE` - Онлайн
- `HYBRID` - Смешанный

### Поля модели Event

| Поле | Тип | Описание |
|------|-----|----------|
| `title` | String | Название |
| `description` | String? | Описание |
| `date` | DateTime | Дата начала |
| `endDate` | DateTime? | Дата окончания (для многодневных) |
| `location` | String? | Место проведения |
| `address` | String? | Адрес |
| `organizer` | String? | Организатор |
| `imageUrl` | String? | URL изображения |
| `documentUrl` | String? | URL положения (PDF/DOC) |
| `phone` | String? | Телефон для записи |
| `prizePool` | String? | Призовой фонд (жёлтая плашка) |
| `eventType` | EventType | Тип мероприятия |
| `eventFormat` | EventFormat | Формат (очно/онлайн/смешанный) |
| `level` | EventLevel? | Уровень мероприятия |
| `maxParticipants` | Int? | Макс. участников |
| `registrationOpen` | Boolean | Открыта ли регистрация |

### Регистрация на мероприятия

- `EventRegistration` - связь пользователя с мероприятием
- Поле `organization` - образовательная организация участника
- Статусы: `REGISTERED`, `CONFIRMED`, `CANCELLED`, `ATTENDED`
- Для MASTER_CLASS и FREE_LESSON показывается модальное окно с телефоном вместо онлайн-записи

## Категории достижений

- `SPORT` - Спорт
- `STUDY` - Учеба
- `CREATIVITY` - Творчество
- `VOLUNTEER` - Волонтерство

## Цветовая схема

| Цвет | HEX | Использование |
|------|-----|---------------|
| Primary (голубой) | `#69C5F8` | Кнопки, ссылки, активные элементы |
| Primary Hover | `#4BA8E0` | Hover-состояния |
| Accent (лаймовый) | `#CDFF07` | Акценты, CTA кнопки |
| Dark | `#313642` | Текст, темный фон |

Переопределения Bootstrap находятся в `frontend/src/index.css`.

## UI особенности

- **Avatar Fallback**: Иконка робота (Bot из lucide-react) для пользователей без фото
- **Hero секция**: Фоновое изображение `/hero-robot.jpg` на главной странице
- **Карточки мероприятий и материалов**: Голубой фон `#69C5F8` с белым текстом, hover-эффект
- **Ближайшее мероприятие**: На главной показывается первое незавершённое мероприятие (дата >= сегодня)

## API Endpoints

### Uploads
- `POST /api/uploads/image` - Загрузка изображения (до 5 MB)
- `POST /api/uploads/file` - Загрузка документа (до 100 MB)

### Materials (требует TEACHER или ADMIN)
- `GET /api/materials` - Список материалов
- `GET /api/materials/:id` - Детали материала
- `POST /api/materials` - Создание материала
- `PATCH /api/materials/:id` - Обновление материала
- `DELETE /api/materials/:id` - Удаление материала
- `POST /api/materials/:id/download` - Инкремент счётчика скачиваний

### Homework (требует авторизацию)
- `GET /api/homework` - Список всех ДЗ (для педагогов)
- `GET /api/homework/my` - Мои ДЗ (для учеников)
- `GET /api/homework/:id` - Детали ДЗ
- `POST /api/homework` - Создание ДЗ (TEACHER/ADMIN)
- `PATCH /api/homework/:id` - Обновление ДЗ (TEACHER/ADMIN)
- `DELETE /api/homework/:id` - Удаление ДЗ (TEACHER/ADMIN)
- `POST /api/homework/:id/submit` - Сдача ДЗ (STUDENT)
- `POST /api/homework/:id/grade/:studentId` - Оценивание (TEACHER/ADMIN)
- `GET /api/homework/:id/submissions` - Список ответов (TEACHER/ADMIN)

### Projects
- `GET /api/projects` - Список проектов
- `GET /api/projects/:id` - Детали проекта
- `POST /api/projects` - Создание проекта (ADMIN)
- `PATCH /api/projects/:id` - Обновление проекта (ADMIN)
- `DELETE /api/projects/:id` - Удаление проекта (ADMIN)

### Articles
- `GET /api/articles` - Список статей
- `GET /api/articles/:slug` - Статья по slug
- `POST /api/articles` - Создание статьи (ADMIN)
- `PATCH /api/articles/:id` - Обновление статьи (ADMIN)
- `DELETE /api/articles/:id` - Удаление статьи (ADMIN)

### Events
- `GET /api/events` - Список мероприятий
- `GET /api/events/:id` - Детали мероприятия
- `POST /api/events` - Создание мероприятия (TEACHER/ADMIN)
- `PATCH /api/events/:id` - Обновление мероприятия (TEACHER/ADMIN)
- `DELETE /api/events/:id` - Удаление мероприятия (TEACHER/ADMIN)
- `POST /api/events/:id/register` - Регистрация на мероприятие
- `DELETE /api/events/:id/register` - Отмена регистрации

### Banners (ADMIN)
- `GET /api/banners` - Список всех баннеров
- `GET /api/banners/active` - Активные баннеры (отсортированные по order)
- `GET /api/banners/:id` - Детали баннера
- `POST /api/banners` - Создание баннера
- `PUT /api/banners/:id` - Обновление баннера
- `DELETE /api/banners/:id` - Удаление баннера

### Pages (CMS)
- `GET /api/pages` - Список страниц
- `GET /api/pages/:slug` - Страница по slug
- `PUT /api/pages/:slug` - Обновление страницы (ADMIN)

## Команды

```bash
# Backend
cd backend
npm run start:dev        # Dev сервер
npm run create-admin     # Создать админа
npx prisma studio        # GUI для БД
npx prisma db push       # Применить изменения схемы

# Frontend
cd frontend
npm run dev              # Dev сервер
npm run build            # Production сборка
```
