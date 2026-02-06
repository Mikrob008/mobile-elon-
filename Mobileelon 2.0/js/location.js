// Управление модальными окнами и категориями

let prevActiveCategoryLink = null;
let prevActiveLocationLink = null;

// Делегирование событий: устойчиво к перерисовке header
document.addEventListener('mousedown', function (e) {
  const deliveryLink = e.target.closest('.ads-delivery');
  const locationBtn = e.target.closest('.main-btn-location-user');
  if (deliveryLink || locationBtn) {
    prevActiveCategoryLink = document.querySelector('.ads-smartphones.active, .ads-accessories.active, .ads-parts.active');
  }
}, true);

document.addEventListener('click', function (e) {
  const deliveryLink = e.target.closest('.ads-delivery');
  if (deliveryLink) {
    deliveryLink.classList.add('active');
    document.querySelectorAll('.ads-smartphones, .ads-accessories, .ads-parts').forEach(link => link.classList.remove('active'));
  }

  const locationBtn = e.target.closest('.main-btn-location-user');
  if (locationBtn) {
    locationBtn.classList.add('active');
    document.querySelectorAll('.ads-smartphones, .ads-accessories, .ads-parts').forEach(link => link.classList.remove('active'));
  }
}, true);

// Инициализация модальных окон
document.addEventListener('DOMContentLoaded', () => {
  // Утилиты открытия/закрытия по id
  // Закрываем открытые dropdown'ы/выпадающие меню, чтобы новые модалки не накладывались
  function closeAllDropdowns() {
    // Закрываем окно уведомлений
    const notifyDropdown = document.getElementById('notifyDropdown');
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyDropdown && !notifyDropdown.hasAttribute('hidden')) {
      notifyDropdown.setAttribute('hidden', '');
      if (notifyBtn) notifyBtn.setAttribute('aria-expanded', 'false');
      // Сбрасываем стили анимации, если они были установлены
      notifyDropdown.style.opacity = '';
      notifyDropdown.style.transform = '';
    }

    // Закрываем профильный дропдаун
    const userProfile = document.querySelector('.user-profile');
    const userBtn = document.querySelector('.user-profile-btn');
    if (userProfile && userProfile.classList.contains('open')) {
      userProfile.classList.remove('open');
      if (userBtn) userBtn.setAttribute('aria-expanded', 'false');
    }

    // Универсально закрываем другие дропдауны с классовым флагом open
    document.querySelectorAll('.dropdown.open, .menu.open').forEach(el => {
      el.classList.remove('open');
    });
  }

  window.openModalById = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Закрываем любые открытые dropdown'ы перед показом модального окна
    try { closeAllDropdowns(); } catch (e) {}

    // Добавляем класс modal-open И показываем модаль одновременно
    document.body.classList.add('modal-open');
    modal.style.display = 'flex';
    
    // Фокус с задержкой в отдельный frame
    requestAnimationFrame(() => {
      const focusableElement = modal.querySelector('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (focusableElement) { focusableElement.focus(); }
    });

    // Hook for dynamically rendered modals
    try {
      if (typeof window.onModalOpened === 'function') window.onModalOpened(modalId);
    } catch (e) {}
  };

  window.closeModalById = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    closeModal(modal);
  };
  // Делегирование кликов по элементам с data-modal-target (в режиме capture),
  // чтобы гарантированно перехватить событие на главной странице
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-target]');
    if (!trigger) return;
    e.preventDefault();
    const modalId = trigger.getAttribute('data-modal-target');
    window.openModalById(modalId);
  }, true);
  
  
  // Обработчики для кнопок закрытия модальных окон
  document.querySelectorAll("[data-modal-close]").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = button.closest(".modal-overlay-location, .modal-overlay-delivery, .modal-overlay-submit-ads, .modal-overlay-auth");
      
      if (!modal) {
        console.warn('Модальное окно не найдено для кнопки закрытия');
        return;
      }
      
      closeModal(modal);
    });
  });

  // Закрытие модальных окон по клику на оверлей
  document.querySelectorAll(".modal-overlay-location, .modal-overlay-delivery, .modal-overlay-submit-ads, .modal-overlay-auth").forEach(overlay => {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Закрытие модальных окон по клавише Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const openModals = document.querySelectorAll(".modal-overlay-location, .modal-overlay-delivery, .modal-overlay-submit-ads, .modal-overlay-auth");
      openModals.forEach(modal => {
        if (modal.style.display === "flex") {
          closeModal(modal);
        }
      });

      // Убираем фокус с активного элемента
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  });
  
  // Обработчики для кнопок "Вся страна" и "Выбрать" в модальном окне локации
  const allCountryBtn = document.querySelector('.btn-all-country');
  const chooseLocationBtn = document.querySelector('.btn-choose-location');
  
  if (allCountryBtn) {
    allCountryBtn.addEventListener('click', function() {
      const locationModal = document.getElementById('locationModal');
      if (locationModal) {
        closeModal(locationModal);
      }
    });
  }
  
  if (chooseLocationBtn) {
    chooseLocationBtn.addEventListener('click', function() {
      const locationModal = document.getElementById('locationModal');
      if (locationModal) {
        closeModal(locationModal);
      }
    });
  }
});

// Функция для закрытия модального окна
function closeModal(modal) {
  if (!modal) return;
  
  modal.style.display = "none";
  try { 
    document.body.classList.remove('modal-open');
  } catch (e) {}
  
  // Специальная обработка для модального окна доставки
  if (modal.id === 'deliveryModal') {
    const deliveryLink = document.querySelector('.ads-delivery');
    if (deliveryLink) {
      deliveryLink.classList.remove('active');
    }
    // Возвращаем активную категорию
    if (prevActiveCategoryLink) {
      prevActiveCategoryLink.classList.add('active');
    }
  }
  
  // Специальная обработка для модального окна локации
  if (modal.id === 'locationModal') {
    const locationLink = document.querySelector('.main-btn-location-user');
    if (locationLink) {
      locationLink.classList.remove('active');
    }
    // Возвращаем активную категорию
    if (prevActiveCategoryLink) {
      prevActiveCategoryLink.classList.add('active');
    }
  }
}
