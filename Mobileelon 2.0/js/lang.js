// Система интернационализации (i18n)

document.addEventListener('DOMContentLoaded', () => {
  console.log('=== Инициализация системы переводов ===');

  // ⚠️ После перехода на вариант с рендером хедера через header.js
  // элементы переключателя языка появляются динамически.
  // Поэтому не выходим сразу, а ждём, пока header.js вмонтирует DOM.
  function waitForLangControls(attempt = 0) {
    const langSwitcher = document.querySelector('.lang-switcher');
    const langBtn = document.getElementById('langBtn');
    const langFlag = document.getElementById('langFlag');
    const langDropdown = document.getElementById('langDropdown');

    if (!langSwitcher || !langBtn || !langDropdown) {
      if (attempt < 30) {
        // ~3 секунды максимум ожидания (30 * 100мс)
        return setTimeout(() => waitForLangControls(attempt + 1), 100);
      }
      console.error('❌ Критические элементы переключателя языка не найдены (таймаут):', {
        langSwitcher: !!langSwitcher,
        langBtn: !!langBtn,
        langDropdown: !!langDropdown
      });
      console.warn('💡 Если вы открыли страницу двойным кликом (file://), fetch() для переводов может быть заблокирован. Запускайте через локальный сервер (Live Server / http.server).');
      return;
    }

    if (!langFlag) {
      console.warn('⚠️ Элемент флага языка (langFlag) не найден — продолжим без него');
    }

    console.log('✅ Базовые элементы переключателя языка найдены');

    initI18n({ langSwitcher, langBtn, langFlag, langDropdown });
  }

  waitForLangControls();

  function initI18n({ langSwitcher, langBtn, langFlag, langDropdown }) {

    // Глобальная переменная для хранения текущих переводов
    let currentTranslations = {};

    // Открытие/закрытие выпадающего меню
    langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langSwitcher.classList.toggle('open');
    console.log('🖱️ Клик по кнопке языка, состояние:', langSwitcher.classList.contains('open'));
    });

  // Выбор языка
    langDropdown.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const lang = this.dataset.lang;
      const flag = this.dataset.flag;
      const labelText = this.textContent.trim();
      
      console.log('🌐 Выбран язык:', lang, 'флаг:', flag, 'текст:', labelText);
      
      // Обновляем флаг и текст (флаг опционален)
      if (langFlag && flag) {
        langFlag.src = flag;
        console.log('🔄 Обновлен флаг:', flag);
      }
      
      const label = document.getElementById('langLabel');
      if (label) {
        label.textContent = labelText;
        console.log('🔄 Обновлен текст:', labelText);
      }
      
      langSwitcher.classList.remove('open');
      setLanguage(lang);
    });
  });

  // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
    if (!langSwitcher.contains(e.target)) {
      langSwitcher.classList.remove('open');
    }
    });

  // Функция смены языка с поддержкой подстраниц, placeholder и title
    function setLanguage(lang) {
    console.log(`🔄 Начинаем смену языка на: ${lang}`);
    
    const isSubpage = window.location.pathname.indexOf('/html/') !== -1;
    const baseDir = isSubpage ? '../js/lang' : 'js/lang';
    const url = `${baseDir}/${lang}.json`;
    
    console.log(`📁 Путь к файлу переводов: ${url}`);
    console.log(`📄 Подстраница: ${isSubpage}`);
    
    fetch(url)
      .then(res => {
        console.log(`📡 Статус ответа: ${res.status} ${res.statusText}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log(`✅ Переводы загружены успешно:`, {
          количество_ключей: Object.keys(data).length,
          ключи: Object.keys(data).slice(0, 5)
        });
        
        // Сохраняем переводы глобально
        currentTranslations = data;
        
        // Обновляем все элементы с переводами
        updatePageTranslations(data);
        
        // Обновляем заголовок страницы
        updatePageTitle(data);
        
        // Обновляем флаг (если доступен)
        updateLanguageFlag(lang);
        
        // Сохраняем выбор в localStorage
        localStorage.setItem('lang', lang);
        
        console.log(`🎉 Язык успешно изменен на: ${lang}`);

        try {
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
        } catch (e) {
          // no-op
        }
      })
      .catch(error => {
        console.error('❌ Ошибка загрузки языкового файла:', error);
        if (window.location.protocol === 'file:') {
          console.warn('💡 Похоже, страница открыта как file://. В этом режиме fetch() часто блокируется. Запустите проект через локальный сервер (Live Server / python -m http.server).');
        }
        if (lang !== 'ru') {
          console.log('🔄 Попытка загрузки русского языка как fallback');
          setLanguage('ru');
        }
      });
    }

  // Экспорт функции для внешнего вызова (консоль/другие скрипты)
    window.setLanguage = setLanguage;

  // Вспомогательная функция: обновить текст, сохраняя вложенные узлы (например, SVG)
    function updateElementTextPreservingChildren(element, newText) {
    // Если нет дочерних элементов, можно безопасно заменить весь текст
    if (!element.children || element.children.length === 0) {
      element.textContent = newText;
      return;
    }

    // 1) Если есть целевой узел для текста
    const explicitTarget = element.querySelector('[data-i18n-text], .i18n-text');
    if (explicitTarget) {
      explicitTarget.textContent = newText;
      return;
    }

    // 2) Ищем существующий текстовый узел среди непосредственных детей
    let textNode = null;
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        textNode = node;
        break;
      }
    }

    if (textNode) {
      // Сохраняем один пробел между иконкой и текстом
      textNode.textContent = ' ' + newText;
      return;
    }

    // 3) Если текстового узла нет, создаем отдельный span для текста
    const span = document.createElement('span');
    span.setAttribute('data-i18n-text', '');
    span.textContent = newText;
    // Добавим пробел, если последний дочерний элемент не текст
    if (element.lastChild && element.lastChild.nodeType !== Node.TEXT_NODE) {
      element.appendChild(document.createTextNode(' '));
    }
    element.appendChild(span);
  }

  // Функция обновления переводов на странице
    function updatePageTranslations(data) {
    console.log('🔄 Обновление переводов на странице...');
    
    let translatedCount = 0;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && data[key]) {
        const oldText = el.textContent;
        updateElementTextPreservingChildren(el, data[key]);
        translatedCount++;
        console.log(`✅ Переведен [data-i18n="${key}"]: "${oldText}" → "${data[key]}"`);
      } else if (key && !data[key]) {
        console.warn(`⚠️ Ключ "${key}" не найден в переводах`);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && data[key]) {
        const oldPlaceholder = el.getAttribute('placeholder');
        el.setAttribute('placeholder', data[key]);
        translatedCount++;
        console.log(`✅ Переведен [data-i18n-placeholder="${key}"]: "${oldPlaceholder}" → "${data[key]}"`);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key && data[key]) {
        const oldTitle = el.getAttribute('title');
        el.setAttribute('title', data[key]);
        translatedCount++;
        console.log(`✅ Переведен [data-i18n-title="${key}"]: "${oldTitle}" → "${data[key]}"`);
      }
    });
    
    console.log(`📊 Всего переведено элементов: ${translatedCount}`);
  }

  // Функция обновления заголовка страницы
    function updatePageTitle(data) {
    const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    let titleKey = 'page_title_index';
    
    if (file.indexOf('accessories') !== -1) titleKey = 'page_title_accessories';
    else if (file.indexOf('parts') !== -1) titleKey = 'page_title_parts';
    else if (file.indexOf('delivery') !== -1) titleKey = 'page_title_delivery';
    
    if (data[titleKey]) {
      const oldTitle = document.title;
      document.title = data[titleKey];
      console.log(`📄 Обновлен заголовок страницы: "${oldTitle}" → "${data[titleKey]}"`);
    } else {
      console.warn(`⚠️ Ключ заголовка "${titleKey}" не найден в переводах`);
    }
  }

  // Функция обновления флага языка (опционально)
    function updateLanguageFlag(lang) {
    const label = document.getElementById('langLabel');
    if (langFlag && langDropdown) {
      const btn = langDropdown.querySelector(`[data-lang="${lang}"]`);
      if (btn && btn.dataset.flag) {
        langFlag.src = btn.dataset.flag;
        console.log(`🔄 Обновлен флаг языка: ${btn.dataset.flag}`);
      }
      if (btn && label) {
        label.textContent = btn.textContent.trim();
      }
    }
  }

  // Публичная функция для получения перевода (для использования в других скриптах)
    window.getTranslation = function(key) {
    const translation = currentTranslations[key] || key;
    console.log(`🔍 getTranslation("${key}") → "${translation}"`);
    return translation;
  };

  // Публичная функция для обновления переводов в динамическом контенте
    window.updateDynamicTranslations = function() {
    console.log('🔄 Обновление динамических переводов...');
    if (currentTranslations) {
      updatePageTranslations(currentTranslations);
    } else {
      console.warn('⚠️ Нет загруженных переводов для обновления');
    }
  };

  // Установка языка при загрузке
    let savedLang = localStorage.getItem('lang') || 'ru';
  if (savedLang === 'en') savedLang = 'ru';
  
  console.log(`🚀 Установка языка при загрузке: ${savedLang}`);
    setLanguage(savedLang);
  
  // Показать подпись текущего языка при загрузке
    const initBtn = langDropdown.querySelector(`[data-lang="${savedLang}"]`);
  if (initBtn) {
    const label = document.getElementById('langLabel');
    if (label) {
      label.textContent = initBtn.textContent.trim();
      console.log(`🏷️ Установлена подпись языка: ${initBtn.textContent.trim()}`);
    }
  }
  
    console.log('=== Инициализация системы переводов завершена ===');
  }
});