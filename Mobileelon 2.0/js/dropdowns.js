// РЈРїСЂР°РІР»РµРЅРёРµ РІС‹РїР°РґР°СЋС‰РёРјРё РјРµРЅСЋ Рё СѓРІРµРґРѕРјР»РµРЅРёСЏРјРё

document.addEventListener('DOMContentLoaded', () => {
  // --- РЈРІРµРґРѕРјР»РµРЅРёСЏ (РµСЃР»Рё РїСЂРёСЃСѓС‚СЃС‚РІСѓСЋС‚ РЅР° СЃС‚СЂР°РЅРёС†Рµ) ---
  const notifyBtn = document.querySelector('.notify-btn');
  const notifyDropdown = document.getElementById('notifyDropdown');
  const notifyBadge = document.getElementById('notifyBadge');

  if (notifyBtn && notifyDropdown) {
    // РћР±СЂР°Р±РѕС‚С‡РёРє РєР»РёРєР° РїРѕ РєРЅРѕРїРєРµ СѓРІРµРґРѕРјР»РµРЅРёР№
    notifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !notifyDropdown.hasAttribute('hidden');
      notifyDropdown.toggleAttribute('hidden', isOpen);
      notifyBtn.setAttribute('aria-expanded', (!isOpen).toString());
      if (!isOpen) {
        notifyDropdown.style.opacity = '';
        notifyDropdown.style.transform = '';
      }
      populateNotifications();
    });

    // Р—Р°РєСЂС‹С‚РёРµ РїРѕ РєР»РёРєСѓ РІРЅРµ РѕР±Р»Р°СЃС‚Рё СѓРІРµРґРѕРјР»РµРЅРёР№
    document.addEventListener('click', (e) => {
      if (!notifyDropdown.contains(e.target) && !notifyBtn.contains(e.target)) {
        if (!notifyDropdown.hasAttribute('hidden')) {
          notifyDropdown.setAttribute('hidden', '');
          notifyBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Р¤СѓРЅРєС†РёСЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ СѓРІРµРґРѕРјР»РµРЅРёР№
  function populateNotifications() {
    const list = document.getElementById('notifyList');
    if (!list) return;

    // РџСЂРѕРІРµСЂСЏРµРј, РµСЃС‚СЊ Р»Рё СѓР¶Рµ СЂРµР°Р»СЊРЅС‹Рµ СѓРІРµРґРѕРјР»РµРЅРёСЏ (РїР»РµР№СЃС…РѕР»РґРµСЂ РёРіРЅРѕСЂРёСЂСѓРµРј)
    if (list.querySelector('.notify-item')) {
      return;
    }

    // РћС‡РёС‰Р°РµРј СЃРїРёСЃРѕРє (СѓР±РёСЂР°РµРј РїР»РµР№СЃС…РѕР»РґРµСЂ)
    list.innerHTML = '';

    // РЎРѕР·РґР°РµРј РґРµРјРѕРЅСЃС‚СЂР°С†РёРѕРЅРЅС‹Рµ СѓРІРµРґРѕРјР»РµРЅРёСЏ
    const notifications = [
      { 
        title: 'Р’Р°С€Рµ РѕР±СЉСЏРІР»РµРЅРёРµ РѕРїСѓР±Р»РёРєРѕРІР°РЅРѕ', 
        body: 'РњРѕРґРµСЂР°С†РёСЏ Р·Р°РІРµСЂС€РµРЅР° СѓСЃРїРµС€РЅРѕ.', 
        time: '1 РјРёРЅ РЅР°Р·Р°Рґ', 
        read: false 
      },
      { 
        title: 'РћРїР»Р°С‚Р° РїСЂРёРЅСЏС‚Р°', 
        body: 'РџРѕРїРѕР»РЅРµРЅРёРµ Р±Р°Р»Р°РЅСЃР° РЅР° 10 000 СЃСѓРј.', 
        time: '1 С‡ РЅР°Р·Р°Рґ', 
        read: true 
      },
      { 
        title: 'РќРѕРІРѕРµ СЃРѕРѕР±С‰РµРЅРёРµ', 
        body: 'РџРѕРєСѓРїР°С‚РµР»СЊ РёРЅС‚РµСЂРµСЃСѓРµС‚СЃСЏ С‚РѕРІР°СЂРѕРј.', 
        time: '2 С‡ РЅР°Р·Р°Рґ', 
        read: true 
      }
    ];

    // РЎРѕР·РґР°РµРј СЌР»РµРјРµРЅС‚С‹ СѓРІРµРґРѕРјР»РµРЅРёР№
    notifications.forEach(notification => {
      const li = createNotificationElement(notification);
      list.appendChild(li);
    });

    // РћР±РЅРѕРІР»СЏРµРј СЃС‡РµС‚С‡РёРє
    setNotificationsCount(notifications.length);
  }

  // Р¤СѓРЅРєС†РёСЏ СЃРѕР·РґР°РЅРёСЏ СЌР»РµРјРµРЅС‚Р° СѓРІРµРґРѕРјР»РµРЅРёСЏ
  function createNotificationElement(notification) {
    const li = document.createElement('li');
    li.className = `notify-item${notification.read ? ' read' : ''}`;
    
    li.innerHTML = `
      <span class="dot"></span>
      <div>
        <div class="title">${escapeHtml(notification.title)}</div>
        <div class="body">${escapeHtml(notification.body)}</div>
        <div class="meta">${escapeHtml(notification.time)}</div>
      </div>
      <button class="btn-close-notify" title="РЈРґР°Р»РёС‚СЊ СѓРІРµРґРѕРјР»РµРЅРёРµ" aria-label="РЈРґР°Р»РёС‚СЊ СѓРІРµРґРѕРјР»РµРЅРёРµ">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#f5c400">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    `;

    // Р”РѕР±Р°РІР»СЏРµРј РѕР±СЂР°Р±РѕС‚С‡РёРє РґР»СЏ РєРЅРѕРїРєРё Р·Р°РєСЂС‹С‚РёСЏ
    const closeBtn = li.querySelector('.btn-close-notify');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeNotification(li);
      });
    }

    return li;
  }

  // Р¤СѓРЅРєС†РёСЏ СѓРґР°Р»РµРЅРёСЏ СѓРІРµРґРѕРјР»РµРЅРёСЏ
  function removeNotification(notificationElement) {
    const list = document.getElementById('notifyList');
    if (!list) return;

    // РЈРґР°Р»СЏРµРј СЌР»РµРјРµРЅС‚
    notificationElement.remove();

    // РџСЂРѕРІРµСЂСЏРµРј РѕСЃС‚Р°РІС€РёРµСЃСЏ СѓРІРµРґРѕРјР»РµРЅРёСЏ
    const remainingItems = list.querySelectorAll('.notify-item');
    
    if (remainingItems.length === 0) {
      // РџРѕРєР°Р·С‹РІР°РµРј СЃРѕРѕР±С‰РµРЅРёРµ РѕР± РѕС‚СЃСѓС‚СЃС‚РІРёРё СѓРІРµРґРѕРјР»РµРЅРёР№
      const emptyText = window.getTranslation ? window.getTranslation('notifications_empty') : 'РќРµС‚ СѓРІРµРґРѕРјР»РµРЅРёР№';
      list.innerHTML = `<li class="notify-empty" data-i18n="notifications_empty">${emptyText}</li>`;
      
      // РћР±РЅРѕРІР»СЏРµРј РїРµСЂРµРІРѕРґС‹ РґР»СЏ РЅРѕРІРѕРіРѕ СЌР»РµРјРµРЅС‚Р°
      if (window.updateDynamicTranslations) {
        window.updateDynamicTranslations();
      }
      setNotificationsCount(0);

      // РџР»Р°РІРЅРѕ Р·Р°РєСЂС‹РІР°РµРј РѕРєРЅРѕ СѓРІРµРґРѕРјР»РµРЅРёР№ С‡РµСЂРµР· 1 СЃРµРєСѓРЅРґСѓ
      setTimeout(() => {
        if (!notifyDropdown.hasAttribute('hidden')) {
          // РђРЅРёРјР°С†РёСЏ Р·Р°РєСЂС‹С‚РёСЏ
          notifyDropdown.style.opacity = '0';
          notifyDropdown.style.transform = 'translateY(-10px)';

          // РџРѕР»РЅРѕСЃС‚СЊСЋ СЃРєСЂС‹РІР°РµРј РїРѕСЃР»Рµ Р°РЅРёРјР°С†РёРё
          setTimeout(() => {
            notifyDropdown.setAttribute('hidden', '');
            notifyBtn.setAttribute('aria-expanded', 'false');
            // РЎР±СЂР°СЃС‹РІР°РµРј СЃС‚РёР»Рё РґР»СЏ СЃР»РµРґСѓСЋС‰РµРіРѕ РѕС‚РєСЂС‹С‚РёСЏ
            notifyDropdown.style.opacity = '';
            notifyDropdown.style.transform = '';
          }, 300);
        }
      }, 1000);
    } else {
      // РћР±РЅРѕРІР»СЏРµРј СЃС‡РµС‚С‡РёРє СѓРІРµРґРѕРјР»РµРЅРёР№
      setNotificationsCount(remainingItems.length);
    }
  }

  // Р¤СѓРЅРєС†РёСЏ РѕР±РЅРѕРІР»РµРЅРёСЏ СЃС‡РµС‚С‡РёРєР° СѓРІРµРґРѕРјР»РµРЅРёР№
  function setNotificationsCount(count) {
    if (!notifyBadge) return;

    if (count > 0) {
      // РџРѕРєР°Р·С‹РІР°РµРј РёРЅРґРёРєР°С‚РѕСЂ Р±РµР· С†РёС„СЂ
      notifyBadge.textContent = '';
      notifyBadge.removeAttribute('hidden');
      notifyBadge.classList.remove('pop');
      
      // Р—Р°РїСѓСЃРєР°РµРј Р°РЅРёРјР°С†РёСЋ pop
      requestAnimationFrame(() => {
        notifyBadge.classList.add('pop');
      });
    } else {
      notifyBadge.setAttribute('hidden', '');
    }
  }

  // Р¤СѓРЅРєС†РёСЏ СЌРєСЂР°РЅРёСЂРѕРІР°РЅРёСЏ HTML РґР»СЏ Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ: СѓСЃС‚Р°РЅР°РІР»РёРІР°РµРј РЅР°С‡Р°Р»СЊРЅРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ СѓРІРµРґРѕРјР»РµРЅРёР№
  if (notifyBadge) setNotificationsCount(3);

  // --- РџСЂРѕС„РёР»СЊ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ (РµСЃР»Рё РїСЂРёСЃСѓС‚СЃС‚РІСѓРµС‚ РЅР° СЃС‚СЂР°РЅРёС†Рµ) ---
  const userProfile = document.querySelector('.user-profile');
  const userBtn = document.querySelector('.user-profile-btn');
  if (userProfile && userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userProfile.classList.toggle('open');
      userBtn.setAttribute('aria-expanded', userProfile.classList.contains('open').toString());
    });
    document.addEventListener('click', (e) => {
      if (!userProfile.contains(e.target) && !userBtn.contains(e.target)) {
        if (userProfile.classList.contains('open')) {
          userProfile.classList.remove('open');
          userBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && userProfile.classList.contains('open')) {
        userProfile.classList.remove('open');
        userBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Р§Р°С‚ (placeholder) ---
  const chatBtn = document.querySelector('.btn-chat');
  if (chatBtn) {
    chatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Р§Р°С‚ СЃРєРѕСЂРѕ Р±СѓРґРµС‚ РґРѕСЃС‚СѓРїРµРЅ.');
    });
  }
});
