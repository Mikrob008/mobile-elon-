// Основной JavaScript файл для Mobile Elon

document.addEventListener('DOMContentLoaded', () => {
  console.log('Mobile Elon - Основной скрипт загружен');
  
  // Проверяем, что все необходимые элементы существуют
  const requiredElements = [
    '.notify-btn',
    '#notifyDropdown',
    '.lang-switcher',
    '#langBtn',
    '.user-profile-btn',
    '.ads-smartphones',
    '.ads-accessories', 
    '.ads-parts',
    '.ads-delivery'
  ];
  
  const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
  if (missingElements.length > 0) {
    console.warn('Отсутствуют элементы:', missingElements);
  }
  
  // Инициализация завершена
  console.log('Инициализация завершена');
});
