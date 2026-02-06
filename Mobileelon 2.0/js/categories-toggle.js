// Управление переключением категорий

document.addEventListener('DOMContentLoaded', () => {
  const categoryLinks = document.querySelectorAll('.ads-smartphones, .ads-accessories, .ads-parts, .ads-delivery');
  
  if (categoryLinks.length === 0) {
    console.warn('Ссылки категорий не найдены');
    return;
  }

  // Определяем активную категорию на основе текущей страницы
  const currentPath = window.location.pathname;
  let activeLink = determineActiveCategory(currentPath, categoryLinks);
  
  // Устанавливаем активный класс
  if (activeLink) {
    categoryLinks.forEach(el => el.classList.remove('active'));
    activeLink.classList.add('active');
    console.log('Установлена активная категория:', activeLink.textContent.trim());
  } else {
    console.log('Активная ссылка не найдена для пути:', currentPath);
  }
  
  // Обработчики кликов по категориям
  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Предотвращаем переход для модальных окон
      if (this.hasAttribute('data-modal-target')) {
        return;
      }
      
      // Убираем активный класс у всех ссылок
      categoryLinks.forEach(el => el.classList.remove('active'));
      // Добавляем активный класс к текущей ссылке
      this.classList.add('active');
      console.log('Активная категория:', this.textContent.trim());
    });
  });
});

// Функция определения активной категории
function determineActiveCategory(currentPath, categoryLinks) {
  // Нормализуем путь
  const normalizedPath = currentPath.toLowerCase().replace(/\/$/, '');
  
  // Определяем активную категорию по пути
  if (normalizedPath.includes('accessories.html') || normalizedPath.includes('/accessories')) {
    return document.querySelector('.ads-accessories');
  } else if (normalizedPath.includes('parts.html') || normalizedPath.includes('/parts')) {
    return document.querySelector('.ads-parts');
  } else if (normalizedPath.includes('delivery.html') || normalizedPath.includes('/delivery')) {
    return document.querySelector('.ads-delivery');
  } else if (normalizedPath === '' || 
             normalizedPath === '/' || 
             normalizedPath.endsWith('index.html') || 
             normalizedPath.endsWith('/index')) {
    return document.querySelector('.ads-smartphones');
  }
  
  // Если путь не соответствует ни одной категории, возвращаем null
  return null;
}