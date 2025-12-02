import { z } from 'zod';

/**
 * Валидаторы для форм с использованием Zod
 */

/**
 * Схема валидации для email
 */
export const emailSchema = z
  .string()
  .min(1, 'Email обязателен')
  .email('Некорректный email');

/**
 * Схема валидации для пароля
 */
export const passwordSchema = z
  .string()
  .min(6, 'Пароль должен содержать минимум 6 символов')
  .max(100, 'Пароль слишком длинный');

/**
 * Схема валидации для имени
 */
export const nameSchema = z
  .string()
  .min(2, 'Минимум 2 символа')
  .max(50, 'Максимум 50 символов')
  .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Только буквы, пробелы и дефисы');

/**
 * Схема валидации для класса
 */
export const classSchema = z
  .string()
  .min(1, 'Класс обязателен')
  .regex(/^\d{1,2}[А-Яа-я]?$/, 'Формат: 9А, 11, 10Б');

/**
 * Схема валидации для биографии
 */
export const bioSchema = z
  .string()
  .max(500, 'Максимум 500 символов')
  .optional();

/**
 * Схема валидации для URL
 */
export const urlSchema = z
  .string()
  .url('Некорректный URL')
  .optional()
  .or(z.literal(''));

/**
 * Схема валидации для баллов
 */
export const pointsSchema = z
  .number()
  .int('Должно быть целое число')
  .min(0, 'Баллы не могут быть отрицательными')
  .max(1000, 'Максимум 1000 баллов');

/**
 * Схема валидации для регистрации пользователя
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  middleName: nameSchema.optional().or(z.literal('')),
  birthDate: z.date({
    required_error: 'Дата рождения обязательна',
    invalid_type_error: 'Некорректная дата'
  }),
  class: classSchema,
  bio: bioSchema
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
});

/**
 * Схема валидации для входа
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

/**
 * Схема валидации для профиля ученика
 */
export const studentProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  middleName: nameSchema.optional().or(z.literal('')),
  birthDate: z.date({
    required_error: 'Дата рождения обязательна',
    invalid_type_error: 'Некорректная дата'
  }),
  class: classSchema,
  bio: bioSchema,
  photoUrl: urlSchema
});

/**
 * Схема валидации для достижения
 */
export const achievementSchema = z.object({
  userId: z.string().min(1, 'Выберите ученика'),
  title: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(100, 'Максимум 100 символов'),
  description: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(1000, 'Максимум 1000 символов'),
  category: z.enum(['sport', 'study', 'creativity', 'volunteer'], {
    errorMap: () => ({ message: 'Выберите категорию' })
  }),
  points: pointsSchema,
  date: z.date({
    required_error: 'Дата обязательна',
    invalid_type_error: 'Некорректная дата'
  }),
  proofUrls: z.array(urlSchema).optional()
});

/**
 * Схема валидации для мероприятия
 */
export const eventSchema = z.object({
  title: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(150, 'Максимум 150 символов'),
  description: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(2000, 'Максимум 2000 символов'),
  date: z.date({
    required_error: 'Дата обязательна',
    invalid_type_error: 'Некорректная дата'
  }),
  location: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(200, 'Максимум 200 символов'),
  address: z
    .string()
    .max(300, 'Максимум 300 символов')
    .optional()
    .or(z.literal('')),
  organizer: z
    .string()
    .max(100, 'Максимум 100 символов')
    .optional()
    .or(z.literal('')),
  imageUrl: urlSchema,
  eventType: z.enum(['MASTER_CLASS', 'COMPETITION', 'FREE_LESSON', 'WORKSHOP', 'OTHER'], {
    errorMap: () => ({ message: 'Выберите тип мероприятия' })
  }),
  level: z
    .enum(['SCHOOL', 'DISTRICT', 'CITY', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL', ''])
    .optional()
    .transform(val => val === '' ? null : val),
  maxParticipants: z
    .union([
      z.number().int().min(1),
      z.string().transform(val => {
        if (val === '' || val === null || val === undefined) return null;
        const num = parseInt(val, 10);
        return isNaN(num) ? null : num;
      })
    ])
    .optional()
    .nullable()
    .transform(val => val === 0 ? null : val),
  registrationOpen: z.boolean().optional().default(true)
});

/**
 * Вспомогательная функция для валидации email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return emailSchema.safeParse(email).success;
};

/**
 * Вспомогательная функция для валидации пароля
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return passwordSchema.safeParse(password).success;
};

/**
 * Вспомогательная функция для валидации имени
 * @param {string} name
 * @returns {boolean}
 */
export const isValidName = (name) => {
  return nameSchema.safeParse(name).success;
};

/**
 * Вспомогательная функция для валидации класса
 * @param {string} classValue
 * @returns {boolean}
 */
export const isValidClass = (classValue) => {
  return classSchema.safeParse(classValue).success;
};

/**
 * Вспомогательная функция для валидации URL
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (!url) return true; // URL необязателен
  return urlSchema.safeParse(url).success;
};

/**
 * Проверка размера файла (в байтах)
 * @param {File} file
 * @param {number} maxSize - максимальный размер в MB
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSize = 5) => {
  if (!file) return false;
  const maxBytes = maxSize * 1024 * 1024;
  return file.size <= maxBytes;
};

/**
 * Проверка типа файла
 * @param {File} file
 * @param {string[]} allowedTypes - массив MIME типов
 * @returns {boolean}
 */
export const isValidFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Проверка изображения (тип и размер)
 * @param {File} file
 * @param {number} maxSize - максимальный размер в MB
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImage = (file, maxSize = 5) => {
  if (!file) {
    return { valid: false, error: 'Файл не выбран' };
  }

  if (!isValidFileType(file)) {
    return { valid: false, error: 'Разрешены только JPG, PNG и WebP' };
  }

  if (!isValidFileSize(file, maxSize)) {
    return { valid: false, error: `Максимальный размер ${maxSize}MB` };
  }

  return { valid: true };
};

/**
 * Очистка строки от лишних пробелов
 * @param {string} str
 * @returns {string}
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Нормализация имени (первая буква заглавная)
 * @param {string} name
 * @returns {string}
 */
export const normalizeName = (name) => {
  if (!name) return '';
  const cleaned = sanitizeString(name);
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

/**
 * Проверка возраста (от 6 до 100 лет)
 * @param {Date} birthDate
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateAge = (birthDate) => {
  if (!birthDate) {
    return { valid: false, error: 'Дата рождения обязательна' };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 6) {
    return { valid: false, error: 'Минимальный возраст 6 лет' };
  }

  if (age > 100) {
    return { valid: false, error: 'Некорректная дата рождения' };
  }

  return { valid: true };
};

/**
 * Проверка даты в будущем
 * @param {Date} date
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  return date > new Date();
};

/**
 * Проверка даты в прошлом
 * @param {Date} date
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  if (!date) return false;
  return date < new Date();
};
