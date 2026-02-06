// Форма подачи объявления: динамические поля, фото-превью, валидация и черновик

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('submitAdsModal');
  const content = modal ? modal.querySelector('.submit-ads-content') : null;
  if (!modal || !content) return;

  let currentForm = null;

  // ---------- Helpers ----------
  function t(key, fallback) {
    try {
      if (typeof window.getTranslation === 'function') {
        const translated = window.getTranslation(key);
        return translated || (fallback || key);
      }
    } catch (e) {}
    return fallback || key;
  }

  function isSubpage() {
    return window.location.pathname.indexOf('/html/') !== -1;
  }

  function dataUrl(path) {
    const base = isSubpage() ? '../js/data' : 'js/data';
    return base + '/' + path;
  }

  function saveDraft(draft) {
    try {
      localStorage.setItem('submit_draft', JSON.stringify(draft));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem('submit_draft');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function pushAd(ad) {
    try {
      const raw = localStorage.getItem('submitted_ads');
      const list = raw ? JSON.parse(raw) : [];
      list.push(ad);
      localStorage.setItem('submitted_ads', JSON.stringify(list));
    } catch (e) {}
  }

  function readAds() {
    try {
      const raw = localStorage.getItem('submitted_ads');
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function writeAds(list) {
    try { localStorage.setItem('submitted_ads', JSON.stringify(list || [])); } catch (e) {}
  }

  function getUserId() {
    try {
      const raw = localStorage.getItem('user_profile');
      const obj = raw ? JSON.parse(raw) : null;
      if (obj && obj.id) return String(obj.id);
    } catch (e) {}
    return '';
  }

  // ---------- Load data ----------
  let smartphones = null;
  let accessories = null;
  let parts = null;

  function loadAllData() {
    return Promise.all([
      fetch(dataUrl('smartphones.json')).then(r => r.json()).catch(() => ({ brands: [], modelsByBrand: {}, ramOptions: [], storageOptions: [] })),
      fetch(dataUrl('accessories.json')).then(r => r.json()).catch(() => ({ categories: {} })),
      fetch(dataUrl('parts.json')).then(r => r.json()).catch(() => ({ partTypes: [], brands: [], modelsByBrand: {} })),
    ]).then(([s, a, p]) => {
      smartphones = s;
      accessories = a;
      parts = p;
    });
  }

  // ---------- Build form ----------
  function buildForm() {
    content.innerHTML = '';

    const form = document.createElement('form');
    form.id = 'submitAdsForm';
    form.setAttribute('novalidate', '');

    // Category
    const fieldCategory = document.createElement('div');
    fieldCategory.className = 'field field-category';
    fieldCategory.innerHTML = `
      <label data-i18n="submit_category">${t('submit_category', 'Категория')}</label>
      <select name="category" required>
        <option value="smartphones">${t('submit_category_smartphones', 'Смартфоны')}</option>
        <option value="accessories">${t('submit_category_accessories', 'Аксессуары')}</option>
        <option value="parts">${t('submit_category_parts', 'Запчасти')}</option>
      </select>
      <div class="error" data-error-for="category" hidden>${t('submit_required', 'Обязательное поле')}</div>
    `;

    // Smartphones group
    const groupSmartphones = document.createElement('div');
    groupSmartphones.className = 'group-smartphones';
    groupSmartphones.innerHTML = `
      <div class="field">
        <label data-i18n="submit_brand">${t('submit_brand', 'Бренд')}</label>
        <select name="s_brand" required></select>
        <div class="error" data-error-for="s_brand" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
      <div class="field">
        <label data-i18n="submit_model">${t('submit_model', 'Модель')}</label>
        <select name="s_model" required></select>
        <div class="error" data-error-for="s_model" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
      <div class="field">
        <label data-i18n="submit_ram">${t('submit_ram', 'ОЗУ')}</label>
        <select name="s_ram" required></select>
        <div class="error" data-error-for="s_ram" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
      <div class="field">
        <label data-i18n="submit_storage">${t('submit_storage', 'Память')}</label>
        <select name="s_storage" required></select>
        <div class="error" data-error-for="s_storage" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
    `;

    // Accessories group
    const groupAccessories = document.createElement('div');
    groupAccessories.className = 'group-accessories';
    groupAccessories.innerHTML = `
      <div class="field">
        <label data-i18n="submit_accessory_category">${t('submit_accessory_category', 'Категория аксессуаров')}</label>
        <select name="a_category" required></select>
        <div class="error" data-error-for="a_category" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
      <div class="field">
        <label data-i18n="submit_accessory_subcategory">${t('submit_accessory_subcategory', 'Подкатегория')}</label>
        <select name="a_subcategory" required></select>
        <div class="error" data-error-for="a_subcategory" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
    `;

    // Parts group
    const groupParts = document.createElement('div');
    groupParts.className = 'group-parts';
    groupParts.innerHTML = `
      <div class="field">
        <label data-i18n="submit_parts_type">${t('submit_parts_type', 'Тип запчасти')}</label>
        <select name="p_type" required></select>
        <div class="error" data-error-for="p_type" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
      <div class="field">
        <label data-i18n="submit_brand">${t('submit_brand', 'Бренд')}</label>
        <select name="p_brand" required></select>
        <div class="error" data-error-for="p_brand" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
      <div class="field">
        <label data-i18n="submit_model">${t('submit_model', 'Модель')}</label>
        <select name="p_model" required></select>
        <div class="error" data-error-for="p_model" hidden>${t('submit_required', 'Обязательное поле')}</div>
      </div>
    `;

    // Common fields
    const fieldTitle = document.createElement('div');
    fieldTitle.className = 'field';
    fieldTitle.innerHTML = `
      <label data-i18n="submit_title">${t('submit_title', 'Заголовок')}</label>
      <input name="title" type="text" maxlength="120" required />
      <div class="error" data-error-for="title" hidden>${t('submit_required', 'Обязательное поле')}</div>
    `;

    const fieldDesc = document.createElement('div');
    fieldDesc.className = 'field';
    fieldDesc.innerHTML = `
      <label data-i18n="submit_description">${t('submit_description', 'Описание')}</label>
      <textarea name="description" rows="4"></textarea>
    `;

    const fieldPrice = document.createElement('div');
    fieldPrice.className = 'field';
    fieldPrice.innerHTML = `
      <label data-i18n="submit_price">${t('submit_price', 'Цена')}</label>
      <input name="price" type="number" min="0" step="1" required />
      <div class="error" data-error-for="price" hidden>${t('submit_required', 'Обязательное поле')}</div>
    `;

    const fieldCondition = document.createElement('div');
    fieldCondition.className = 'field';
    fieldCondition.innerHTML = `
      <label data-i18n="submit_condition">${t('submit_condition', 'Состояние')}</label>
      <select name="condition" required>
        <option value="new">${t('condition_new', 'Новое')}</option>
        <option value="used">${t('condition_used', 'Б/у')}</option>
      </select>
      <div class="error" data-error-for="condition" hidden>${t('submit_required', 'Обязательное поле')}</div>
    `;

    const fieldContactName = document.createElement('div');
    fieldContactName.className = 'field';
    fieldContactName.innerHTML = `
      <label data-i18n="submit_contact_name">${t('submit_contact_name', 'Имя')}</label>
      <input name="contact_name" type="text" required />
      <div class="error" data-error-for="contact_name" hidden>${t('submit_required', 'Обязательное поле')}</div>
    `;

    const fieldContactPhone = document.createElement('div');
    fieldContactPhone.className = 'field';
    fieldContactPhone.innerHTML = `
      <label data-i18n="submit_contact_phone">${t('submit_contact_phone', 'Телефон')}</label>
      <input name="contact_phone" type="tel" placeholder="+998 xx xxx xx xx" required />
      <div class="error" data-error-for="contact_phone" hidden>${t('submit_required', 'Обязательное поле')}</div>
    `;

    // Photos
    const fieldPhotos = document.createElement('div');
    fieldPhotos.className = 'field field-photos';
    fieldPhotos.innerHTML = `
      <label data-i18n="submit_photos">${t('submit_photos', 'Фотографии')}</label>
      <input name="photos" type="file" accept="image/*" multiple />
      <div class="photos-preview" aria-live="polite"></div>
      <small class="hint">${t('submit_add_photos', 'Добавить фото')} (max 8)</small>
    `;

    // Actions
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.innerHTML = `
      <button type="button" class="btn-save-draft">${t('submit_btn_save_draft', 'Сохранить черновик')}</button>
      <button type="button" class="btn-clear">${t('submit_btn_clear', 'Очистить')}</button>
      <button type="submit" class="btn-publish primary">${t('submit_btn_publish', 'Опубликовать')}</button>
    `;

    form.appendChild(fieldCategory);
    form.appendChild(groupSmartphones);
    form.appendChild(groupAccessories);
    form.appendChild(groupParts);
    form.appendChild(fieldTitle);
    form.appendChild(fieldDesc);
    form.appendChild(fieldPrice);
    form.appendChild(fieldCondition);
    form.appendChild(fieldContactName);
    form.appendChild(fieldContactPhone);
    form.appendChild(fieldPhotos);
    form.appendChild(actions);

    content.innerHTML = '';
    content.appendChild(form);

    currentForm = form;

    initCategoryLogic(form);
    initPhotos(form);
    initValidationAndSubmit(form);
    restoreDraftIfAny(form);

    applyEditModeUI(form);

    if (window.updateDynamicTranslations) window.updateDynamicTranslations();
  }

  function applyEditModeUI(form) {
    const editId = String(localStorage.getItem('edit_ad_id') || '').trim();
    const titleEl = modal.querySelector('.submit-ads-title');
    const publishBtn = form.querySelector('.btn-publish');
    if (editId) {
      if (titleEl) titleEl.textContent = t('submit_edit_title', 'Редактировать объявление');
      if (publishBtn) publishBtn.textContent = t('submit_btn_save', 'Сохранить');
    } else {
      if (titleEl) titleEl.textContent = t('submit_ads_title', 'Подать объявление');
      if (publishBtn) publishBtn.textContent = t('submit_btn_publish', 'Опубликовать');
    }
  }

  // Если открыли модалку на редактирование из профиля
  document.addEventListener('submitads:edit', () => {
    try {
      if (currentForm) {
        // При редактировании черновик уже записан в localStorage, перезаполним форму
        restoreDraftIfAny(currentForm);
        applyEditModeUI(currentForm);
      }
    } catch (e) {}
  });

  // ---------- Category logic ----------
  function initCategoryLogic(form) {
    const category = form.querySelector('select[name="category"]');
    const sBrand = form.querySelector('select[name="s_brand"]');
    const sModel = form.querySelector('select[name="s_model"]');
    const sRam = form.querySelector('select[name="s_ram"]');
    const sStorage = form.querySelector('select[name="s_storage"]');
    const aCat = form.querySelector('select[name="a_category"]');
    const aSub = form.querySelector('select[name="a_subcategory"]');
    const pType = form.querySelector('select[name="p_type"]');
    const pBrand = form.querySelector('select[name="p_brand"]');
    const pModel = form.querySelector('select[name="p_model"]');

    function showGroup(name) {
      form.querySelector('.group-smartphones').style.display = name === 'smartphones' ? '' : 'none';
      form.querySelector('.group-accessories').style.display = name === 'accessories' ? '' : 'none';
      form.querySelector('.group-parts').style.display = name === 'parts' ? '' : 'none';
    }

    // Populate initial options
    if (smartphones) {
      fillOptions(sBrand, smartphones.brands);
      fillOptions(sRam, smartphones.ramOptions);
      fillOptions(sStorage, smartphones.storageOptions);
      updateModelsByBrand(sBrand, sModel, smartphones.modelsByBrand);
      sBrand.addEventListener('change', () => updateModelsByBrand(sBrand, sModel, smartphones.modelsByBrand));
    }
    if (accessories) {
      const cats = Object.keys(accessories.categories || {});
      fillOptions(aCat, cats);
      updateAccessorySub(aCat, aSub);
      aCat.addEventListener('change', () => updateAccessorySub(aCat, aSub));
    }
    if (parts) {
      fillOptions(pType, parts.partTypes);
      fillOptions(pBrand, parts.brands);
      updateModelsByBrand(pBrand, pModel, parts.modelsByBrand);
      pBrand.addEventListener('change', () => updateModelsByBrand(pBrand, pModel, parts.modelsByBrand));
    }

    // Switch group on category change
    category.addEventListener('change', () => {
      showGroup(category.value);
      autosave(form);
    });

    // Default
    showGroup(category.value || 'smartphones');

    // Autosave on change
    form.addEventListener('change', () => autosave(form));
    form.addEventListener('input', () => autosave(form));
  }

  function fillOptions(select, list) {
    const prev = select.value;
    select.innerHTML = '';
    (list || []).forEach(v => {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = String(v);
      select.appendChild(opt);
    });
    if (list && list.indexOf(prev) !== -1) select.value = prev;
  }

  function updateModelsByBrand(brandSelect, modelSelect, modelsByBrand) {
    const brand = brandSelect.value;
    const models = (modelsByBrand && modelsByBrand[brand]) ? modelsByBrand[brand] : [];
    fillOptions(modelSelect, models);
  }

  function updateAccessorySub(aCat, aSub) {
    const cat = aCat.value;
    const subObj = (accessories && accessories.categories && accessories.categories[cat]) || {};
    const subs = Object.keys(subObj);
    fillOptions(aSub, subs);
  }

  // ---------- Photos ----------
  function initPhotos(form) {
    const input = form.querySelector('input[name="photos"]');
    const preview = form.querySelector('.photos-preview');
    const max = 8;
    let images = [];

    function render() {
      preview.innerHTML = '';
      images.forEach((src, idx) => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.style.display = 'inline-block';
        item.style.margin = '6px';
        item.style.position = 'relative';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'photo ' + (idx + 1);
        img.style.width = '84px';
        img.style.height = '84px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        const del = document.createElement('button');
        del.type = 'button';
        del.textContent = '×';
        del.style.position = 'absolute';
        del.style.top = '0';
        del.style.right = '0';
        del.style.border = '0';
        del.style.background = 'rgba(0,0,0,0.5)';
        del.style.color = '#fff';
        del.style.width = '22px';
        del.style.height = '22px';
        del.style.lineHeight = '20px';
        del.style.borderRadius = '50%';
        del.style.cursor = 'pointer';
        del.addEventListener('click', () => {
          images.splice(idx, 1);
          render();
          autosave(form);
        });
        item.appendChild(img);
        item.appendChild(del);
        preview.appendChild(item);
      });
    }

    input.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      const available = Math.max(0, max - images.length);
      const take = files.slice(0, available);
      if (take.length === 0) return;
      Promise.all(take.map(fileToDataUrl)).then(list => {
        images = images.concat(list);
        render();
        autosave(form);
      });
      input.value = '';
    });

    // Expose for draft restore
    form.__getImages = () => images.slice();
    form.__setImages = (arr) => { images = (arr || []).slice(0, max); render(); };
  }

  function fileToDataUrl(file) {
    return new Promise(res => {
      const reader = new FileReader();
      reader.onload = () => res(String(reader.result || ''));
      reader.readAsDataURL(file);
    });
  }

  // ---------- Validation & Submit ----------
  function initValidationAndSubmit(form) {
    function setError(name, show) {
      const el = form.querySelector(`[data-error-for="${name}"]`);
      if (!el) return;
      el.hidden = !show;
    }

    function validate() {
      let ok = true;
      const data = collectForm(form);
      const required = ['category', 'title', 'price', 'condition', 'contact_name', 'contact_phone'];
      required.forEach(k => {
        const isEmpty = !data[k] && data[k] !== 0;
        setError(k, isEmpty);
        if (isEmpty) ok = false;
      });
      if (data.category === 'smartphones') {
        ['s_brand', 's_model', 's_ram', 's_storage'].forEach(k => { const bad = !data[k]; setError(k, bad); if (bad) ok = false; });
      } else if (data.category === 'accessories') {
        ['a_category', 'a_subcategory'].forEach(k => { const bad = !data[k]; setError(k, bad); if (bad) ok = false; });
      } else if (data.category === 'parts') {
        ['p_type', 'p_brand', 'p_model'].forEach(k => { const bad = !data[k]; setError(k, bad); if (bad) ok = false; });
      }
      return ok;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;
      const data = collectForm(form);
      const now = Date.now();
      const editId = String(localStorage.getItem('edit_ad_id') || '').trim();

      // Привязываем к пользователю (если он есть)
      const userId = getUserId();
      if (userId) data.sellerId = userId;

      // Статусы: published / hidden / draft
      data.status = 'published';

      if (editId) {
        // Обновляем существующее объявление
        const list = readAds();
        const idx = list.findIndex(a => String(a.id || a.createdAt || '') === editId);
        if (idx !== -1) {
          const prev = list[idx] || {};
          const createdAt = prev.createdAt || now;
          list[idx] = { ...prev, ...data, id: editId, createdAt, updatedAt: now };
          writeAds(list);
        } else {
          // если не нашли — сохраняем как новое
          data.createdAt = now;
          data.id = String(now);
          data.updatedAt = now;
          pushAd(data);
        }
        try { localStorage.removeItem('edit_ad_id'); } catch (e) {}
      } else {
        data.createdAt = now;
        data.id = String(now);
        data.updatedAt = now;
        pushAd(data);
      }

      try { alert(t('submit_saved', 'Объявление сохранено')); } catch (e) {}
      // Clear draft
      saveDraft({});
      form.reset();
      if (form.__setImages) form.__setImages([]);

      // Обновим UI профиля/списков, если слушают
      try { document.dispatchEvent(new CustomEvent('ads:changed')); } catch (e) {}
    });

    const btnSave = form.querySelector('.btn-save-draft');
    if (btnSave) btnSave.addEventListener('click', () => {
      autosave(form, true);
      try { alert(t('submit_saved', 'Объявление сохранено')); } catch (e) {}
    });

    const btnClear = form.querySelector('.btn-clear');
    if (btnClear) btnClear.addEventListener('click', () => {
      form.reset();
      if (form.__setImages) form.__setImages([]);
      autosave(form);
    });
  }

  function collectForm(form) {
    const fd = new FormData(form);
    const obj = {};
    fd.forEach((v, k) => {
      // Игнорируем файловые поля (будем хранить отдельно dataURL'ы в images)
      if (v instanceof File) return;
      if (k === 'photos') return;
      obj[k] = String(v);
    });
    if (form.__getImages) obj.images = form.__getImages();
    return obj;
  }

  let autosaveTimer = null;
  function autosave(form, immediate) {
    const doSave = () => {
      const draft = collectForm(form);
      saveDraft(draft);
    };
    if (immediate) return doSave();
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(doSave, 400);
  }

  function restoreDraftIfAny(form) {
    const draft = loadDraft();
    if (!draft) return;
    const fill = (name, value) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return;
      // Не устанавливаем программно значение файловых инпутов
      if (el.type === 'file') return;
      el.value = value;
    };
    Object.keys(draft).forEach(k => {
      if (k === 'images' || k === 'photos') return;
      fill(k, draft[k]);
    });
    if (draft.category) {
      const evt = new Event('change', { bubbles: true });
      const cat = form.querySelector('[name="category"]');
      if (cat) cat.dispatchEvent(evt);
    }
    if (Array.isArray(draft.images) && form.__setImages) {
      form.__setImages(draft.images);
    }
  }

  // ---------- Init ----------
  loadAllData().then(buildForm);
});


