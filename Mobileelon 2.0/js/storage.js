/**
 * ========================================
 * УПРАВЛЕНИЕ ЛОКАЛЬНЫМ ХРАНИЛИЩЕМ (Storage)
 * ========================================
 * 
 * Единый API для работы с localStorage.
 * Избегает дублирования кода и ошибок при работе с хранилищем.
 * 
 * API:
 *   - Store.get(key, default)      - получить значение
 *   - Store.set(key, value)        - установить значение
 *   - Store.remove(key)            - удалить значение
 *   - Store.clear()                - очистить все
 *   - Store.has(key)               - проверить наличие
 *   - Store.keys()                 - получить все ключи
 */

const Store = (() => {
  // Константы ключей для централизованного управления
  const KEYS = {
    // Профиль
    USER_PROFILE: 'user_profile',
    USER_ID: 'app_user_id',
    IS_AUTH: 'isAuth',
    IS_VERIFIED: 'isVerified',

    // Объявления
    SUBMITTED_ADS: 'submitted_ads',
    DRAFT_AD: 'submit_draft',
    EDIT_AD_ID: 'edit_ad_id',
    FAVORITE_ADS: 'favorite_ads',

    // Локация
    SELECTED_LOCATION: 'selected_location',

    // Язык и локализация
    LANGUAGE: 'app_language',

    // Профиль (с userId динамически)
    PROFILE_PREFIX: 'profile_',
    ACTIVITIES_PREFIX: 'profile_activities_',
    VERIFICATION_PREFIX: 'verification_',
    RATING_PREFIX: 'profile_rating_',
    PREFERENCES_PREFIX: 'profile_preferences_'
  };

  // Приватные настройки
  const config = {
    debug: false,
    prefix: '', // глобальный префикс для всех ключей
    maxSize: 5 * 1024 * 1024 // 5MB лимит
  };

  // ===== ВНУТРЕННИЕ ФУНКЦИИ =====

  /**
   * Построить финальный ключ с учетом префикса
   * @private
   */
  function buildKey(key) {
    return config.prefix ? `${config.prefix}_${key}` : key;
  }

  /**
   * Логировать действие (если debug включен)
   * @private
   */
  function log(action, key, value) {
    if (!config.debug) return;
    console.log(`[Store] ${action}: ${key}`, value);
  }

  /**
   * Оценить размер данных
   * @private
   */
  function estimateSize(value) {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch (e) {
      return 0;
    }
  }

  // ===== ПУБЛИЧНЫЙ API =====

  return {
    // ===== ОСНОВНЫЕ ОПЕРАЦИИ =====

    /**
     * Получить значение из хранилища
     * @param {string} key - ключ
     * @param {*} defaultValue - значение по умолчанию
     * @returns {*} значение или defaultValue
     */
    get(key, defaultValue = null) {
      const fullKey = buildKey(key);
      
      try {
        const raw = localStorage.getItem(fullKey);
        
        if (raw === null) {
          log('GET_MISS', key);
          return defaultValue;
        }

        // Пытаемся распарсить как JSON
        try {
          const parsed = JSON.parse(raw);
          log('GET_HIT', key, parsed);
          return parsed;
        } catch (e) {
          // Если не JSON, возвращаем как строку
          log('GET_STRING', key, raw);
          return raw;
        }
      } catch (e) {
        console.warn(`⚠️ Ошибка при чтении '${key}':`, e);
        return defaultValue;
      }
    },

    /**
     * Установить значение в хранилище
     * @param {string} key - ключ
     * @param {*} value - значение
     * @returns {boolean} успех операции
     */
    set(key, value) {
      const fullKey = buildKey(key);
      
      try {
        // Преобразуем значение в JSON если это объект
        let toStore = value;
        if (value !== null && typeof value === 'object') {
          toStore = JSON.stringify(value);
        } else if (typeof value !== 'string') {
          toStore = JSON.stringify(value);
        }

        // Проверяем размер
        const size = estimateSize(toStore);
        if (size > config.maxSize) {
          console.warn(`⚠️ Значение для '${key}' слишком большое (${size} bytes)`);
          return false;
        }

        localStorage.setItem(fullKey, toStore);
        log('SET', key, value);
        return true;
      } catch (e) {
        console.error(`❌ Ошибка при записи '${key}':`, e);
        
        // QuotaExceededError - хранилище переполнено
        if (e.name === 'QuotaExceededError') {
          console.error('❌ localStorage переполнен');
        }
        
        return false;
      }
    },

    /**
     * Удалить значение из хранилища
     * @param {string} key - ключ
     * @returns {boolean} успех операции
     */
    remove(key) {
      const fullKey = buildKey(key);
      
      try {
        localStorage.removeItem(fullKey);
        log('REMOVE', key);
        return true;
      } catch (e) {
        console.warn(`⚠️ Ошибка при удалении '${key}':`, e);
        return false;
      }
    },

    /**
     * Очистить все значения
     * @returns {boolean} успех операции
     */
    clear() {
      try {
        if (config.prefix) {
          // Удаляем только ключи с нашим префиксом
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(config.prefix)) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } else {
          // Полная очистка
          localStorage.clear();
        }
        log('CLEAR_ALL');
        return true;
      } catch (e) {
        console.warn('⚠️ Ошибка при очистке хранилища:', e);
        return false;
      }
    },

    /**
     * Проверить наличие ключа
     * @param {string} key - ключ
     * @returns {boolean} есть ли ключ
     */
    has(key) {
      const fullKey = buildKey(key);
      return localStorage.getItem(fullKey) !== null;
    },

    /**
     * Получить все ключи
     * @returns {string[]} массив ключей
     */
    keys() {
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!config.prefix || key.startsWith(config.prefix)) {
          allKeys.push(key);
        }
      }
      return allKeys;
    },

    // ===== СПЕЦИАЛИЗИРОВАННЫЕ ОПЕРАЦИИ =====

    /**
     * Получить значение с типом (type-safe getter)
     * @param {string} key - ключ
     * @param {string} type - тип: 'string', 'number', 'boolean', 'object', 'array'
     * @param {*} defaultValue - значение по умолчанию
     * @returns {*} значение правильного типа
     */
    getAs(key, type, defaultValue = null) {
      const value = this.get(key);
      
      if (value === null || value === undefined) {
        return defaultValue;
      }

      switch (type) {
        case 'string':
          return String(value);
        case 'number':
          return Number(value);
        case 'boolean':
          return Boolean(value);
        case 'object':
          return (typeof value === 'object') ? value : defaultValue;
        case 'array':
          return Array.isArray(value) ? value : defaultValue;
        default:
          return value;
      }
    },

    /**
     * Получить объект с слиянием значений
     * @param {string} key - ключ
     * @param {object} defaultValue - объект по умолчанию
     * @returns {object} объект
     */
    getObject(key, defaultValue = {}) {
      return this.getAs(key, 'object', defaultValue) || defaultValue;
    },

    /**
     * Получить массив
     * @param {string} key - ключ
     * @param {array} defaultValue - массив по умолчанию
     * @returns {array} массив
     */
    getArray(key, defaultValue = []) {
      return this.getAs(key, 'array', defaultValue) || defaultValue;
    },

    /**
     * Обновить объект (merge)
     * @param {string} key - ключ
     * @param {object} updates - обновления
     * @returns {object} обновленный объект
     */
    updateObject(key, updates) {
      const current = this.getObject(key, {});
      const updated = { ...current, ...updates };
      this.set(key, updated);
      return updated;
    },

    /**
     * Добавить элемент в массив
     * @param {string} key - ключ
     * @param {*} item - элемент
     * @param {number} maxItems - макс количество элементов
     * @returns {array} обновленный массив
     */
    pushToArray(key, item, maxItems = null) {
      const current = this.getArray(key, []);
      current.unshift(item);
      
      if (maxItems && current.length > maxItems) {
        current.length = maxItems; // Обрезаем до maxItems
      }
      
      this.set(key, current);
      return current;
    },

    // ===== КОНФИГУРАЦИЯ =====

    /**
     * Установить конфигурацию
     * @param {object} options - опции
     */
    configure(options = {}) {
      Object.assign(config, options);
      log('CONFIG', null, config);
    },

    /**
     * Получить конфигурацию
     * @returns {object} конфигурация
     */
    getConfig() {
      return { ...config };
    },

    /**
     * Получить константы ключей
     * @returns {object} константы
     */
    getKeys() {
      return { ...KEYS };
    },

    /**
     * Экспортировать все данные (для сохранения)
     * @returns {object} все данные
     */
    export() {
      const result = {};
      this.keys().forEach(key => {
        result[key] = this.get(key);
      });
      return result;
    },

    /**
     * Импортировать данные (для восстановления)
     * @param {object} data - данные для импорта
     * @returns {boolean} успех операции
     */
    import(data) {
      try {
        Object.entries(data).forEach(([key, value]) => {
          this.set(key, value);
        });
        log('IMPORT', null, Object.keys(data).length);
        return true;
      } catch (e) {
        console.error('❌ Ошибка при импорте:', e);
        return false;
      }
    }
  };
})();

// ===== ЭКСПОРТ =====

window.Store = Store;

// Инициализируем с debug режимом если нужно
Store.configure({
  debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
});

console.log('✅ Store инициализирован');
