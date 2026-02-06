/**
 * ========================================
 * СИСТЕМА ИНТЕРНАЦИОНАЛИЗАЦИИ (i18n)
 * ========================================
 * 
 * Централизованное управление переводами.
 * Избегает дублирования логики в разных файлах.
 * 
 * API:
 *   - i18n.get(key, fallback)          - получить перевод
 *   - i18n.setLanguage(lang)           - установить язык
 *   - i18n.getLanguage()               - получить текущий язык
 *   - i18n.on('change', callback)      - подписаться на изменение языка
 *   - i18n.updateDOM(elements)         - обновить текст в DOM
 */

const i18n = (() => {
  // Приватное состояние
  let currentLang = 'ru';
  let translations = {};
  const listeners = [];
  
  // Кэш загруженных языков
  const cache = {};

  // ===== ВНУТРЕННИЕ ФУНКЦИИ =====

  /**
   * Загрузить переводы для языка
   * @private
   */
  async function loadLanguage(lang) {
    // Проверяем кэш
    if (cache[lang]) {
      translations = cache[lang];
      currentLang = lang;
      return translations;
    }

    try {
      // Используем глобальную функцию из utils.js
      const path = getLangPath(lang);
      const data = await fetch(path)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        });
      
      cache[lang] = data;
      translations = data;
      currentLang = lang;
      
      console.log(`✅ Язык '${lang}' загружен (${Object.keys(data).length} ключей)`);
      return data;
    } catch (error) {
      console.error(`❌ Ошибка загрузки языка '${lang}':`, error);
      
      // Fallback на русский если ошибка и текущий язык не русский
      if (lang !== 'ru' && cache['ru']) {
        translations = cache['ru'];
        currentLang = lang; // Сохраняем выбранный язык в UI
        return translations;
      }
      
      return translations || {};
    }
  }

  /**
   * Уведомить подписчиков об изменении
   * @private
   */
  function notifyListeners(lang) {
    listeners.forEach(callback => {
      try {
        callback({ language: lang });
      } catch (e) {
        console.warn('⚠️ Ошибка в обработчике события i18n:', e);
      }
    });
  }

  function updateSwitcherUI(lang) {
    const langSwitcher = document.querySelector('.lang-switcher');
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langLabel = document.getElementById('langLabel');
    const langFlag = document.getElementById('langFlag');
    if (!langDropdown) return;
    const btn = langDropdown.querySelector(`[data-lang="${lang}"]`);
    if (btn && langLabel) {
      langLabel.textContent = btn.textContent.trim();
    }
    if (btn && langFlag && btn.dataset.flag) {
      langFlag.src = btn.dataset.flag;
      langFlag.alt = lang.toUpperCase();
    }
    if (langSwitcher) langSwitcher.classList.remove('open');
    if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
  }

  // ===== ПУБЛИЧНЫЙ API =====

  return {
    /**
     * Получить перевод по ключу
     * @param {string} key - ключ перевода
     * @param {string} fallback - текст при отсутствии ключа
     * @returns {string} перевод или fallback
     */
    get(key, fallback = key) {
      if (!key) return fallback;
      
      // Поддержка вложенных ключей: "level.title"
      const keys = key.split('.');
      let value = translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return fallback;
        }
      }
      
      return typeof value === 'string' ? value : fallback;
    },

    /**
     * Установить язык приложения
     * @param {string} lang - код языка (e.g. 'ru', 'uz')
     * @returns {Promise<void>}
     */
    async setLanguage(lang) {
      if (currentLang === lang) {
        console.log(`ℹ️ Язык уже установлен на '${lang}'`);
        updateSwitcherUI(lang);
        return;
      }

      console.log(`🔄 Переключение на язык: ${lang}`);
      await loadLanguage(lang);
      
      try {
        localStorage.setItem('app_language', lang);
      } catch (e) {
        console.warn('⚠️ Не удалось сохранить язык в localStorage:', e);
      }
      
      updateSwitcherUI(lang);
      notifyListeners(lang);
    },

    /**
     * Получить текущий язык
     * @returns {string} текущий язык
     */
    getLanguage() {
      return currentLang;
    },

    /**
     * Получить все доступные переводы
     * @returns {object} объект переводов
     */
    getAll() {
      return { ...translations };
    },

    /**
     * Установить переводы вручную (для тестирования)
     * @param {string} lang - код языка
     * @param {object} trans - объект переводов
     */
    setTranslations(lang, trans) {
      cache[lang] = trans;
      if (lang === currentLang) {
        translations = trans;
      }
    },

    /**
     * Подписаться на событие изменения языка
     * @param {string} event - 'change'
     * @param {function} callback - функция-обработчик
     */
    on(event, callback) {
      if (event === 'change' && typeof callback === 'function') {
        listeners.push(callback);
      }
    },

    /**
     * Отписаться от события
     * @param {string} event - 'change'
     * @param {function} callback - функция-обработчик
     */
    off(event, callback) {
      if (event === 'change') {
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
      }
    },

    /**
     * Обновить текст в DOM элементах
     * Ищет элементы с атрибутом data-i18n
     * @param {Element|Element[]} elements - элемент или массив элементов
     */
    updateDOM(elements = document.body) {
      if (!Array.isArray(elements)) {
        elements = [elements];
      }

      const updateElementText = (el, text) => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
          return;
        }
        if (el.children && el.children.length > 0) {
          const target = el.querySelector('[data-i18n-text], .i18n-text, .btn-label, .chat-label');
          if (target) {
            target.textContent = text;
            return;
          }
        }
        el.textContent = text;
      };

      elements.forEach(container => {
        // Найти элементы с data-i18n атрибутом
        const translatable = container.querySelectorAll('[data-i18n]');
        
        translatable.forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (key) {
            const text = this.get(key);
            updateElementText(el, text);
          }
        });

        // Обновить атрибуты (title, placeholder и т.д.)
        const translAttr = container.querySelectorAll('[data-i18n-attr]');
        translAttr.forEach(el => {
          const attr = el.getAttribute('data-i18n-attr');
          const key = el.getAttribute(`data-i18n-${attr}`);
          if (key) {
            const text = this.get(key);
            el.setAttribute(attr, text);
          }
        });
      });
    },

    /**
     * Инициализировать систему i18n
     * @param {string} defaultLang - язык по умолчанию
     * @returns {Promise<void>}
     */
    async init(defaultLang = 'ru') {
      const savedLang = localStorage.getItem('app_language') || defaultLang;
      
      console.log(`📍 Инициализация i18n с языком: ${savedLang}`);
      await this.setLanguage(savedLang);
      
      // Слушаем событие languagechange для синхронизации с другими модулями
      window.addEventListener('languagechange', (e) => {
        const { lang } = e.detail || {};
        if (lang) {
          this.setLanguage(lang);
        }
      });

      return Promise.resolve();
    },

    /**
     * Инициализировать переключатель языка в DOM
     * (Интеграция с header.js)
     */
    initSwitcher() {
      let attempts = 0;
      const init = () => {
        const langSwitcher = document.querySelector('.lang-switcher');
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');

        if (!langBtn || !langDropdown || !langSwitcher) {
          attempts += 1;
          if (attempts < 30) {
            setTimeout(init, 100);
            return;
          }
          console.warn('⚠️ Элементы переключателя языка не найдены');
          return;
        }

        langBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = langSwitcher.classList.toggle('open');
          langBtn.setAttribute('aria-expanded', String(isOpen));
        });

        langDropdown.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = btn.getAttribute('data-lang');
            if (lang) {
              this.setLanguage(lang);
            }
          });
        });

        document.addEventListener('click', (e) => {
          if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
            langBtn.setAttribute('aria-expanded', 'false');
          }
        });

        updateSwitcherUI(this.getLanguage());
      };
      init();
    }
  };
})();

// ===== ИНИЦИАЛИЗАЦИЯ =====

document.addEventListener('DOMContentLoaded', async () => {
  // Инициализируем систему
  await i18n.init();

  // Инициализируем переключатель языка
  i18n.initSwitcher();
  
  // Обновляем DOM
  i18n.updateDOM(document.body);

  // Слушаем изменения языка и обновляем DOM
  i18n.on('change', () => {
    i18n.updateDOM(document.body);
    console.log('🔄 DOM обновлен для нового языка');
  });
});

// ===== ЭКСПОРТ =====

window.i18n = i18n;

// Глобальная функция для обратной совместимости с существующим кодом
window.getTranslation = (key, fallback) => i18n.get(key, fallback);

console.log('✅ i18n система инициализирована');
