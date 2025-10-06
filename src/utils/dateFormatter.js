/**
 * Утилиты для форматирования дат
 */

/**
 * Форматирует timestamp в читаемую дату
 * @param {Date|number|object} date - дата (Date, timestamp или Firebase Timestamp)
 * @param {string} format - формат вывода ('short', 'long', 'full', 'time')
 * @returns {string} - отформатированная дата
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  // Конвертируем Firebase Timestamp в Date
  let dateObj;
  if (date?.toDate) {
    dateObj = date.toDate();
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return '';
  }

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    },
    datetime: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };

  return dateObj.toLocaleDateString('ru-RU', options[format] || options.short);
};

/**
 * Форматирует дату в формат DD.MM.YYYY
 * @param {Date|number|object} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  return formatDate(date, 'short');
};

/**
 * Форматирует дату в формат "1 января 2024"
 * @param {Date|number|object} date
 * @returns {string}
 */
export const formatDateLong = (date) => {
  return formatDate(date, 'long');
};

/**
 * Форматирует дату в формат "понедельник, 1 января 2024"
 * @param {Date|number|object} date
 * @returns {string}
 */
export const formatDateFull = (date) => {
  return formatDate(date, 'full');
};

/**
 * Форматирует время в формат HH:MM
 * @param {Date|number|object} date
 * @returns {string}
 */
export const formatTime = (date) => {
  return formatDate(date, 'time');
};

/**
 * Форматирует дату и время в формат DD.MM.YYYY HH:MM
 * @param {Date|number|object} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'datetime');
};

/**
 * Возвращает относительную дату ("сегодня", "вчера", "3 дня назад")
 * @param {Date|number|object} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';

  let dateObj;
  if (date?.toDate) {
    dateObj = date.toDate();
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return '';
  }

  const now = new Date();
  const diffTime = now - dateObj;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes === 0) return 'только что';
      return `${diffMinutes} ${pluralize(diffMinutes, 'минута', 'минуты', 'минут')} назад`;
    }
    return `${diffHours} ${pluralize(diffHours, 'час', 'часа', 'часов')} назад`;
  } else if (diffDays === 1) {
    return 'вчера';
  } else if (diffDays < 7) {
    return `${diffDays} ${pluralize(diffDays, 'день', 'дня', 'дней')} назад`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${pluralize(weeks, 'неделя', 'недели', 'недель')} назад`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${pluralize(months, 'месяц', 'месяца', 'месяцев')} назад`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${pluralize(years, 'год', 'года', 'лет')} назад`;
  }
};

/**
 * Вычисляет возраст по дате рождения
 * @param {Date|number|object} birthDate
 * @returns {number}
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;

  let dateObj;
  if (birthDate?.toDate) {
    dateObj = birthDate.toDate();
  } else if (typeof birthDate === 'number') {
    dateObj = new Date(birthDate);
  } else if (birthDate instanceof Date) {
    dateObj = birthDate;
  } else {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - dateObj.getFullYear();
  const monthDiff = today.getMonth() - dateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate())) {
    age--;
  }

  return age;
};

/**
 * Проверяет, является ли дата текущим месяцем
 * @param {Date|number|object} date
 * @returns {boolean}
 */
export const isCurrentMonth = (date) => {
  if (!date) return false;

  let dateObj;
  if (date?.toDate) {
    dateObj = date.toDate();
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return false;
  }

  const now = new Date();
  return dateObj.getMonth() === now.getMonth() &&
         dateObj.getFullYear() === now.getFullYear();
};

/**
 * Проверяет, является ли дата текущим годом
 * @param {Date|number|object} date
 * @returns {boolean}
 */
export const isCurrentYear = (date) => {
  if (!date) return false;

  let dateObj;
  if (date?.toDate) {
    dateObj = date.toDate();
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return false;
  }

  const now = new Date();
  return dateObj.getFullYear() === now.getFullYear();
};

/**
 * Возвращает начало текущего месяца
 * @returns {Date}
 */
export const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

/**
 * Возвращает начало текущего года
 * @returns {Date}
 */
export const getStartOfYear = () => {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
};

/**
 * Склонение числительных (1 день, 2 дня, 5 дней)
 * @param {number} number
 * @param {string} one - форма для 1 (день)
 * @param {string} two - форма для 2-4 (дня)
 * @param {string} five - форма для 5+ (дней)
 * @returns {string}
 */
export const pluralize = (number, one, two, five) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
};

/**
 * Парсит строку даты в объект Date
 * @param {string} dateString - строка формата DD.MM.YYYY
 * @returns {Date|null}
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  const parts = dateString.split('.');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // месяцы с 0
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  // Проверка валидности
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }

  return date;
};
