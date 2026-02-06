/**
 * ========================================
 * УТИЛИТЫ: Общие вспомогательные функции
 * ========================================
 * 
 * Централизованное место для часто используемых функций.
 * Избегает дублирования кода в разных файлах.
 * 
 * Использование:
 *   - isSubpage()          - проверка, открыта ли подстраница
 *   - getDataPath(file)    - получить путь к JSON данных
 *   - ensureUserId()       - получить или создать ID пользователя
 *   - safeJsonParse(str)   - безопасный парсинг JSON
 */

// ===== ПРОВЕРКА КОНТЕКСТА =====

/**
 * Проверяет, находимся ли мы на подстранице (html/)
 * @returns {boolean} true если на подстранице
 */
function isSubpage() {
  return window.location.pathname.indexOf('/html/') !== -1;
}

/**
 * Получить путь к файлу данных (smartphones.json и т.д.)
 * Автоматически определяет, находимся ли на подстранице
 * @param {string} filename - имя файла (e.g. 'smartphones.json')
 * @returns {string} полный путь к файлу
 */
function getDataPath(filename) {
  const baseDir = isSubpage() ? '../js/data' : 'js/data';
  return `${baseDir}/${filename}`;
}

/**
 * Получить путь к языковому файлу
 * @param {string} lang - код языка (e.g. 'ru', 'uz')
 * @returns {string} полный путь к файлу
 */
function getLangPath(lang) {
  const baseDir = isSubpage() ? '../js/lang' : 'js/lang';
  return `${baseDir}/${lang}.json`;
}

// ===== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕМ =====

/**
 * Получить или создать уникальный ID пользователя
 * @returns {string} ID пользователя
 */
function ensureUserId() {
  const STORAGE_KEY = 'app_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    // Генерируем уникальный ID: timestamp + random
    userId = String(Date.now()) + '_' + Math.random().toString(36).substr(2, 9);
    try {
      localStorage.setItem(STORAGE_KEY, userId);
    } catch (e) {
      console.warn('⚠️ Не удалось сохранить userId в localStorage:', e);
    }
  }
  
  return userId;
}

/**
 * Получить текущий язык приложения
 * @returns {string} код языка (по умолчанию 'ru')
 */
function getCurrentLanguage() {
  return localStorage.getItem('app_language') || 'ru';
}

/**
 * Установить текущий язык приложения
 * @param {string} lang - код языка
 */
function setCurrentLanguage(lang) {
  try {
    localStorage.setItem('app_language', lang);
  } catch (e) {
    console.warn('⚠️ Не удалось сохранить язык:', e);
  }
}

// ===== JSON УТИЛИТЫ =====

/**
 * Безопасный парсинг JSON
 * @param {string} jsonString - строка для парсинга
 * @param {*} defaultValue - значение по умолчанию при ошибке
 * @returns {*} распарсенный объект или defaultValue
 */
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn('⚠️ Ошибка при парсинге JSON:', e);
    return defaultValue;
  }
}

/**
 * Безопасная сериализация в JSON
 * @param {*} obj - объект для сериализации
 * @returns {string|null} JSON строка или null при ошибке
 */
function safeJsonStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.warn('⚠️ Ошибка при сериализации JSON:', e);
    return null;
  }
}

// ===== FETCH УТИЛИТЫ =====

/**
 * Загрузить JSON файл с обработкой ошибок
 * @param {string} url - URL файла
 * @param {*} defaultValue - значение по умолчанию при ошибке
 * @returns {Promise<*>} загруженные данные
 */
async function fetchJson(url, defaultValue = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`⚠️ Ошибка загрузки ${url}:`, error);
    return defaultValue;
  }
}

/**
 * Загрузить несколько JSON файлов параллельно
 * @param {string[]} urls - массив URL'ов
 * @param {*} defaultValue - значение по умолчанию для каждого при ошибке
 * @returns {Promise<*[]>} массив загруженных данных
 */
async function fetchJsonMultiple(urls, defaultValue = null) {
  const promises = urls.map(url => fetchJson(url, defaultValue));
  return Promise.all(promises);
}

// ===== DOM УТИЛИТЫ =====

/**
 * Найти элемент с fallback'ом
 * @param {string} selector - CSS селектор
 * @returns {Element|null} элемент или null
 */
function safeFindElement(selector) {
  try {
    return document.querySelector(selector);
  } catch (e) {
    console.warn(`⚠️ Ошибка при поиске элемента ${selector}:`, e);
    return null;
  }
}

/**
 * Установить текст элемента с проверкой
 * @param {string} selector - CSS селектор
 * @param {string} text - текст для установки
 * @returns {boolean} успех операции
 */
function safeSetText(selector, text) {
  const el = safeFindElement(selector);
  if (el) {
    try {
      el.textContent = text;
      return true;
    } catch (e) {
      console.warn(`⚠️ Ошибка при установке текста:`, e);
    }
  }
  return false;
}

/**
 * Получить значение атрибута с fallback'ом
 * @param {string} selector - CSS селектор
 * @param {string} attribute - имя атрибута
 * @param {string} defaultValue - значение по умолчанию
 * @returns {string} значение атрибута
 */
function safeGetAttribute(selector, attribute, defaultValue = '') {
  const el = safeFindElement(selector);
  return el ? (el.getAttribute(attribute) || defaultValue) : defaultValue;
}

// ===== КЛАСС ИНИЦИАЛИЗАЦИИ =====

/**
 * Ждем, пока будут готовы необходимые элементы DOM
 * @param {string[]} selectors - массив селекторов
 * @param {number} timeout - максимальное время ожидания в ms
 * @param {number} interval - интервал проверки в ms
 * @returns {Promise<boolean>} true если все найдены, false если timeout
 */
async function waitForElements(selectors, timeout = 3000, interval = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const allFound = selectors.every(sel => document.querySelector(sel));
    if (allFound) return true;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  console.warn('⚠️ Timeout при ожидании элементов:', selectors);
  return false;
}

// ===== ЭКСПОРТ =====

// Убедитесь, что все функции доступны глобально
window.AppUtils = {
  isSubpage,
  getDataPath,
  getLangPath,
  ensureUserId,
  getCurrentLanguage,
  setCurrentLanguage,
  safeJsonParse,
  safeJsonStringify,
  fetchJson,
  fetchJsonMultiple,
  safeFindElement,
  safeSetText,
  safeGetAttribute,
  waitForElements
};

// Также экспортируем в глобальный scope для удобства
Object.assign(window, {
  isSubpage,
  getDataPath,
  getLangPath,
  ensureUserId,
  getCurrentLanguage,
  setCurrentLanguage,
  safeJsonParse,
  safeJsonStringify,
  fetchJson,
  fetchJsonMultiple
});

console.log('✅ AppUtils инициализирован');
