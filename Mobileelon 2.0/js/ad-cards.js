// РљРѕРјРїРѕРЅРµРЅС‚ РєР°СЂС‚РѕС‡РµРє РѕР±СЉСЏРІР»РµРЅРёР№ Рё СЂРµРЅРґРµСЂ СЃРїРёСЃРєР°

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('adList');
  if (!listContainer) return;

  function t(key, fallback) {
    try {
      if (typeof window.getTranslation === 'function') {
        const translated = window.getTranslation(key);
        return translated || (fallback || key);
      }
    } catch (e) {}
    return fallback || key;
  }

  function formatPrice(value) {
    const num = Number(value || 0);
    try {
      return new Intl.NumberFormat('ru-RU').format(num);
    } catch (e) {
      return String(num);
    }
  }

  function getCurrency() {
    return t('currency_sum', 'СЃСѓРј');
  }

  function getLocationLabel() {
    // Р•СЃР»Рё РµСЃС‚СЊ РІС‹Р±СЂР°РЅРЅР°СЏ Р»РѕРєР°С†РёСЏ вЂ” РѕС‚РѕР±СЂР°Р·РёРј, РёРЅР°С‡Рµ "Р’СЃСЏ СЃС‚СЂР°РЅР°"
    try {
      const saved = localStorage.getItem('selected_location');
      if (saved) {
        const obj = JSON.parse(saved);
        if (obj && (obj.city || obj.region)) {
          return [obj.city, obj.region].filter(Boolean).join(', ');
        }
      }
    } catch (e) {}
    return t('location_all_country', 'Р’СЃСЏ СЃС‚СЂР°РЅР°');
  }

  function createAdCard(ad) {
    const card = document.createElement('article');
    card.className = 'ad-card';
    const adId = String(ad.id || ad.createdAt || '');
    card.setAttribute('data-ad-id', adId);

    const href = '#';

    const imgWrapper = document.createElement('a');
    imgWrapper.href = href;
    imgWrapper.className = 'ad-card-thumb';
    // badge (e.g., Hit)
    const showHot = ad.hot === true || ad.hot === undefined; // РїРѕРєР°Р·С‹РІР°РµРј РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ РґР»СЏ РґРµРјРѕ
    if (showHot) {
      const badge = document.createElement('div');
      badge.className = 'ad-badge ad-badge-hot';
      badge.textContent = t('badge_hot', 'РҐРёС‚');
      imgWrapper.appendChild(badge);
    }
    const hasImage = Array.isArray(ad.images) && ad.images.length > 0;
    if (hasImage) {
      const img = document.createElement('img');
      img.src = ad.images[0];
      img.alt = ad.title || '';
      img.loading = 'lazy';
      imgWrapper.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'ad-card-thumb-placeholder';
      ph.textContent = (ad.category || 'Ad').slice(0, 2).toUpperCase();
      imgWrapper.appendChild(ph);
    }

    const body = document.createElement('div');
    body.className = 'ad-card-body';

    const title = document.createElement('a');
    title.href = href;
    title.className = 'ad-card-title';
    title.textContent = ad.title || t('ad_no_title', 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ');

    const meta = document.createElement('div');
    meta.className = 'ad-card-meta';
    const location = document.createElement('span');
    location.className = 'ad-card-location';
    location.textContent = ad.location || getLocationLabel();
    const condition = document.createElement('span');
    condition.className = 'ad-card-badge';
    condition.textContent = ad.condition === 'new' ? t('condition_new', 'РќРѕРІРѕРµ') : t('condition_used', 'Р‘/Сѓ');
    meta.appendChild(location);
    meta.appendChild(condition);

    const monthly = document.createElement('div');
    monthly.className = 'ad-card-monthly';
    const monthlyAmount = Math.max(1, Math.round(Number(ad.price || 0) / 24));
    monthly.textContent = `${formatPrice(monthlyAmount)} ${getCurrency()} ${t('monthly_suffix', 'РІ РјРµСЃ / 24 РјРµСЃ')}`;

    const footer = document.createElement('div');
    footer.className = 'ad-card-footer';
    const price = document.createElement('div');
    price.className = 'ad-card-price';
    price.innerHTML = `${formatPrice(ad.price || 0)} <span class="currency">${getCurrency()}</span>`;
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'ad-card-fav';
    action.setAttribute('aria-label', 'Р’ РёР·Р±СЂР°РЅРЅРѕРµ');
    action.classList.toggle('active', isFav(adId));
    action.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.714-4.418-9.428-7.132C.857 12.153.857 8.8 3 6.657a4.714 4.714 0 016.667 0L12 8l2.333-1.343A4.714 4.714 0 0121 6.657c2.143 2.143 2.143 5.496.428 7.211C18.714 16.582 12 21 12 21z" stroke="#f5c400" stroke-width="1.6" fill="none"/></svg>';
    action.addEventListener('click', (e) => {
      e.preventDefault();
      const id = adId;
      const fav = getFavIds();
      const exists = fav.includes(id);
      const next = exists ? fav.filter(x => x !== id) : [...fav, id];
      setFavIds(next);
      action.classList.toggle('active', !exists);
      try { document.dispatchEvent(new CustomEvent('favorites:changed')); } catch (err) {}
    });
    footer.appendChild(price);
    footer.appendChild(action);

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(monthly);
    body.appendChild(footer);

    card.appendChild(imgWrapper);
    card.appendChild(body);

    return card;
  }

  function getSubmittedAds() {
    try {
      const raw = localStorage.getItem('submitted_ads');
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) return list;
    } catch (e) {}
    return [];
  }

  function saveSubmittedAds(list) {
    try {
      localStorage.setItem('submitted_ads', JSON.stringify(Array.isArray(list) ? list : []));
    } catch (e) {}
  }

  function seedOneDefaultAdIfEmpty() {
    const now = Date.now();
    return [{
      category: 'smartphones',
      title: 'Xiaomi Redmi Note 13, 8/256',
      price: 2799000,
      condition: 'new',
      images: [],
      createdAt: now,
      id: String(now),
      updatedAt: now,
      status: 'published',
      location: ''
    }];
  }

  function getDemoAdsIfEmpty() {
    const currency = getCurrency();
    return [
      { category: 'smartphones', title: 'Samsung Galaxy S24, 8/256', price: 10999000, condition: 'new', images: [] },
      { category: 'smartphones', title: 'iPhone 13, 128 GB', price: 7999000, condition: 'used', images: [] },
      { category: 'accessories', title: 'Р§РµС…РѕР» СЃРёР»РёРєРѕРЅРѕРІС‹Р№ РґР»СЏ iPhone 15', price: 99000, condition: 'new', images: [] },
      { category: 'accessories', title: 'Р—Р°СЂСЏРґРєР° 30W USB-C', price: 199000, condition: 'new', images: [] },
      { category: 'parts', title: 'Р”РёСЃРїР»РµР№ РґР»СЏ Redmi Note 10', price: 499000, condition: 'new', images: [] },
      { category: 'parts', title: 'РђРєРєСѓРјСѓР»СЏС‚РѕСЂ РґР»СЏ iPhone X', price: 249000, condition: 'new', images: [] }
    ];
  }

  function renderAdList(container, ads) {
    container.innerHTML = '';
    ads.forEach(ad => {
      container.appendChild(createAdCard(ad));
    });
  }

  const ads = getSubmittedAds().filter(ad => ad && ad.status !== 'hidden');
  if (ads.length > 0) {
    renderAdList(listContainer, ads.slice(-24).reverse());
  } else {
    const seeded = seedOneDefaultAdIfEmpty();
    renderAdList(listContainer, seeded);
  }

  // РћР±РЅРѕРІР»СЏРµРј С†РµРЅС‹/С‚РµРєСЃС‚С‹ РїСЂРё СЃРјРµРЅРµ СЏР·С‹РєР°
  window.addEventListener('languagechange', () => {
    const current = getSubmittedAds().filter(ad => ad && ad.status !== 'hidden');
    const list = current.length ? current : seedOneDefaultAdIfEmpty();
    renderAdList(listContainer, list);
  });
});


  function getFavIds() {
    try {
      const raw = localStorage.getItem('favorite_ads');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function setFavIds(arr) {
    try { localStorage.setItem('favorite_ads', JSON.stringify(arr)); } catch (e) {}
  }

  function isFav(id) {
    return getFavIds().includes(String(id));
  }



