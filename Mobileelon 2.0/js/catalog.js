document.addEventListener('DOMContentLoaded', () => {
  const catalogBtn = document.querySelector('.catalog-btn');
  if (!catalogBtn) return;
  const catalogIcon = catalogBtn.querySelector('.icon-catalog');
  let closeIcon = catalogBtn.querySelector('.icon-catalog-close');
  if (!closeIcon) {
    // Inject X icon once (hidden by default)
    closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeIcon.setAttribute('class', 'icon-catalog-close');
    closeIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    closeIcon.setAttribute('width', '20');
    closeIcon.setAttribute('height', '20');
    closeIcon.setAttribute('viewBox', '0 0 20 20');
    closeIcon.setAttribute('fill', 'white');
    closeIcon.style.display = 'none';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5.5 5.5a1 1 0 0 1 1.4 0L10 8.6l3.1-3.1a1 1 0 1 1 1.4 1.4L11.4 10l3.1 3.1a1 1 0 0 1-1.4 1.4L10 11.4l-3.1 3.1a1 1 0 1 1-1.4-1.4L8.6 10 5.5 6.9a1 1 0 0 1 0-1.4z');
    closeIcon.appendChild(path);
    // Insert right before the button text (after existing svg if present)
    if (catalogIcon && catalogIcon.nextSibling) {
      catalogBtn.insertBefore(closeIcon, catalogIcon.nextSibling);
    } else {
      catalogBtn.insertBefore(closeIcon, catalogBtn.firstChild);
    }
  }

  // ---------- Data loaders and i18n helper ----------
  function resolveDataUrl(file) {
    const isSubpage = window.location.pathname.indexOf('/html/') !== -1;
    const baseDir = isSubpage ? '../js/data' : 'js/data';
    return `${baseDir}/${file}`;
  }

  function t(key, fallback) {
    try {
      if (typeof window.getTranslation === 'function') {
        const translated = window.getTranslation(key);
        return translated || (fallback || key);
      }
    } catch (e) {}
    return fallback || key;
  }

  function loadSmartphonesData() {
    if (window.__smartphonesData) return Promise.resolve(window.__smartphonesData);
    return fetch(resolveDataUrl('smartphones.json'))
      .then(r => r.json())
      .then(d => { window.__smartphonesData = d; return d; })
      .catch(() => ({ brands: [], modelsByBrand: {}, ramOptions: [], storageOptions: [] }));
  }

  function loadAccessoriesData() {
    if (window.__accessoriesData) return Promise.resolve(window.__accessoriesData);
    return fetch(resolveDataUrl('accessories.json'))
      .then(r => r.json())
      .then(d => { window.__accessoriesData = d; return d; })
      .catch(() => ({ categories: {} }));
  }

  function loadPartsData() {
    if (window.__partsData) return Promise.resolve(window.__partsData);
    return fetch(resolveDataUrl('parts.json'))
      .then(r => r.json())
      .then(d => { window.__partsData = d; return d; })
      .catch(() => ({ partTypes: [], brands: [], modelsByBrand: {} }));
  }

  // Mega dropdown under header (empty skeleton)
  let pageOverlay = document.getElementById('catalogPageOverlay');
  let mega = document.getElementById('catalogMega');
  let lastFocusedBeforeOpen = null;

  if (!pageOverlay) {
    pageOverlay = document.createElement('div');
    pageOverlay.id = 'catalogPageOverlay';
    pageOverlay.style.position = 'fixed';
    pageOverlay.style.inset = '0';
    pageOverlay.style.background = 'transparent';
    pageOverlay.style.display = 'none';
    pageOverlay.style.zIndex = '9998';
    document.body.appendChild(pageOverlay);
  }

  if (!mega) {
    mega = document.createElement('div');
    mega.id = 'catalogMega';
    mega.setAttribute('role', 'dialog');
    mega.setAttribute('aria-modal', 'true');
    mega.setAttribute('aria-label', 'РљР°С‚Р°Р»РѕРі');
    mega.style.position = 'absolute';
    mega.style.left = '0';
    mega.style.right = '0';
    mega.style.display = 'none';
    mega.style.background = '#fff';
    mega.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    mega.style.borderRadius = '8px';
    mega.style.zIndex = '9999';
    mega.style.minHeight = '360px';
    mega.style.maxHeight = '70vh';
    mega.style.overflow = 'auto';
    mega.style.padding = '16px';

    mega.innerHTML = `
      <div id="catalogMegaContent"></div>
    `;

    document.body.appendChild(mega);
  }

  function isOpen() {
    return mega.style.display === 'block';
  }

  function positionMega() {
    const header = document.querySelector('header');
    if (!header) return;
    const headerRect = header.getBoundingClientRect();
    const top = headerRect.top + window.scrollY + headerRect.height;
    mega.style.top = top + 'px';

    // Align left to inner header container
    const mainHeader = document.querySelector('.main-header');
    const containerRect = mainHeader ? mainHeader.getBoundingClientRect() : document.body.getBoundingClientRect();
    const viewportPadding = 12; // small side padding on very wide screens

    // Anchor to the catalog/search group to shift dropdown to the right
    const anchor = document.querySelector('.catalog-search-group') || document.querySelector('.catalog-btn');
    let left = containerRect.left + window.scrollX;
    if (anchor) {
      const ar = anchor.getBoundingClientRect();
      left = ar.left + window.scrollX;
    }
    mega.style.left = left + 'px';

    // Width will be computed based on visible columns for compact look
    requestAnimationFrame(updateMegaWidth);
  }

  // Compute dropdown width based on visible columns to avoid empty right area
  function updateMegaWidth() {
    const layout = document.querySelector('#catalogMegaContent > div');
    if (!layout) return;
    const mainHeader = document.querySelector('.main-header');
    const headerRect = mainHeader ? mainHeader.getBoundingClientRect() : document.body.getBoundingClientRect();
    const maxContainer = headerRect.width || (document.body.getBoundingClientRect().width || window.innerWidth);

    const visibleChildren = Array.from(layout.children).filter(el => {
      // offsetParent is null for display:none
      return el && el.offsetParent !== null;
    });

    // Sum widths of visible columns and include gaps from layout.gap (16px)
    const gapPx = 16;
    const gaps = Math.max(0, visibleChildren.length - 1) * gapPx;
    const totalChildrenWidth = visibleChildren.reduce((sum, el) => sum + el.offsetWidth, 0);
    const padding = 16; // inner padding already applied inside columns
    let desiredWidth = totalChildrenWidth + gaps + padding;

    // Safety bounds
    const minWidth = 520; // do not shrink too much on desktop
    const maxWidth = Math.max(360, Math.min(maxContainer, window.innerWidth - 24));
    desiredWidth = Math.min(Math.max(desiredWidth, minWidth), maxWidth);

    // On mobile, keep full width with small paddings
    if (window.innerWidth < 768) {
      const viewportPadding = 12;
      desiredWidth = window.innerWidth - viewportPadding * 2;
    }

    mega.style.width = desiredWidth + 'px';

    // Clamp left within container so the dropdown doesn't overflow to the right
    const containerLeft = headerRect.left + window.scrollX;
    const containerRight = containerLeft + headerRect.width;
    let left = parseFloat(mega.style.left) || containerLeft;
    const rightEdge = left + desiredWidth;
    if (rightEdge > containerRight) {
      left = Math.max(containerLeft, containerRight - desiredWidth);
      mega.style.left = left + 'px';
    }
  }

  // Toggle thin vertical dividers between visible columns
  function updateColumnDividers() {
    const layout = document.querySelector('#catalogMegaContent > div');
    if (!layout) return;
    const allChildren = Array.from(layout.children);
    // Ensure all columns have a base class for CSS hook
    allChildren.forEach(el => el.classList && el.classList.add('catalog-column'));
    const visible = allChildren.filter(el => el && el.offsetParent !== null);
    visible.forEach(el => el.classList && el.classList.remove('with-divider'));
    for (let i = 0; i < visible.length - 1; i++) {
      visible[i].classList && visible[i].classList.add('with-divider');
    }
  }

  function openMega() {
    if (isOpen()) return;
    lastFocusedBeforeOpen = document.activeElement;
    positionMega();
    mega.style.display = 'block';
    catalogBtn.setAttribute('aria-expanded', 'true');
    // Toggle button icons
    if (catalogIcon) catalogIcon.style.display = 'none';
    if (closeIcon) closeIcon.style.display = '';
    
    // Render appropriate catalog based on current page
    const category = getCurrentCategory();
    switch (category) {
      case 'smartphones':
        renderSmartphoneFlow();
        break;
      case 'accessories':
        renderAccessoriesFlow();
        break;
      case 'parts':
        renderPartsFlow();
        break;
      default:
        renderSmartphoneFlow();
    }

    // Ensure width fits rendered content and update dividers
    requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });
  }

  function closeMega() {
    if (!isOpen()) return;
    mega.style.display = 'none';
    catalogBtn.setAttribute('aria-expanded', 'false');
    // Toggle button icons back
    if (catalogIcon) catalogIcon.style.display = '';
    if (closeIcon) closeIcon.style.display = 'none';
    if (lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === 'function') {
      lastFocusedBeforeOpen.focus();
    }
  }

    catalogBtn.addEventListener('click', (e) => {
      e.stopPropagation();
    if (isOpen()) closeMega(); else openMega();
  });

  // Close on click outside (since overlay is disabled)
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    const target = e.target;
    if (mega.contains(target)) return;
    if (catalogBtn.contains(target)) return;
    closeMega();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMega();
  });

  window.addEventListener('resize', () => {
    if (isOpen()) positionMega();
  });
  window.addEventListener('scroll', () => {
    if (isOpen()) positionMega();
  });

  mega.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.closest('[data-close-catalog]')) closeMega();
  });

  // ---------- Determine current page category ----------
  function getCurrentCategory() {
    const catalogBtn = document.querySelector('.catalog-btn');
    const currentPath = (window.location && window.location.pathname) ? window.location.pathname : '';

    // 1) Try to infer by i18n key on the button (language-agnostic)
    const i18nKey = catalogBtn ? catalogBtn.getAttribute('data-i18n') || '' : '';
    if (i18nKey.includes('accessories')) return 'accessories';
    if (i18nKey.includes('parts')) return 'parts';
    if (i18nKey.includes('smartphones')) return 'smartphones';

    // 2) Use active top category link if present
    const activeTop = document.querySelector('.categories .active');
    if (activeTop) {
      if (activeTop.classList.contains('ads-accessories')) return 'accessories';
      if (activeTop.classList.contains('ads-parts')) return 'parts';
      if (activeTop.classList.contains('ads-smartphones')) return 'smartphones';
    }

    // 3) Fall back to URL path
    if (currentPath.includes('accessories.html')) return 'accessories';
    if (currentPath.includes('parts.html')) return 'parts';

    // Default
    return 'smartphones';
  }

  // ---------- Smartphone flow: Brand -> Model (skeleton) ----------
  function renderSmartphoneFlow() {
    const container = document.getElementById('catalogMegaContent');
    if (!container) return;
    container.innerHTML = '';
    container.style.paddingTop = '8px';

    const layout = document.createElement('div');
    layout.style.display = 'flex';
    layout.style.gap = '16px';
    layout.style.alignItems = 'flex-start';

    // Left: brands, Center: models, Right: RAM, Far-right: Storage
    const center = document.createElement('div');
    center.id = 'catalogCenterContent';
    center.classList.add('catalog-column');
    center.style.flex = '0 0 280px';
    center.style.width = '280px';
    center.style.minHeight = '200px';
    center.style.borderRadius = '12px';
    center.style.background = '#fff';
    center.style.border = '0';
    center.style.padding = '8px';

    const right = document.createElement('div');
    right.id = 'catalogRightContent';
    right.classList.add('catalog-column');
    right.style.flex = '0 0 180px';
    right.style.width = '180px';
    right.style.minHeight = '200px';
    right.style.borderRadius = '12px';
    right.style.background = '#fff';
    right.style.border = '0';
    right.style.padding = '8px';
    right.style.display = 'none';

    const farRight = document.createElement('div');
    farRight.id = 'catalogFarRightContent';
    farRight.classList.add('catalog-column');
    farRight.style.flex = '0 0 180px';
    farRight.style.width = '180px';
    farRight.style.minHeight = '200px';
    farRight.style.borderRadius = '12px';
    farRight.style.background = '#fff';
    farRight.style.border = '0';
    farRight.style.padding = '8px';
    farRight.style.display = 'none';

    layout.appendChild(center);
    layout.appendChild(right);
    layout.appendChild(farRight);
    container.appendChild(layout);

    loadSmartphonesData().then(data => {
      const left = renderBrandPanel(center, right, farRight, data.brands, data);
      left.classList.add('catalog-column');
      layout.insertBefore(left, center);
      requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });
    });
  }

  function renderBrandPanel(centerContainer, rightContainer, farRightContainer, brands, data) {
    const panel = document.createElement('div');
    panel.style.width = '320px';
    panel.style.maxWidth = '100%';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.border = '0';
    panel.style.borderRadius = '12px';
    panel.style.background = '#fff';
    panel.style.padding = '8px';

    const title = document.createElement('div');
    title.textContent = t('brand_title', 'Р‘СЂРµРЅРґ');
    title.style.fontWeight = '600';
    title.style.margin = '0 0 8px';
    title.classList.add('catalog-panel-title');
    panel.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '0';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';
    list.style.maxHeight = '60vh';
    list.style.overflow = 'auto';

    brands.forEach(brand => {
      const li = document.createElement('li');
      li.style.position = 'relative';
      li.style.borderRadius = '10px';
      li.style.background = '#fff';
      li.style.cursor = 'pointer';

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.border = '0';
      row.style.borderRadius = '12px';
      row.style.transition = 'background 120ms ease';

      // Left icon + text wrapper
      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '10px';

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      icon.setAttribute('width', '18');
      icon.setAttribute('height', '18');
      icon.setAttribute('viewBox', '0 0 20 20');
      icon.setAttribute('fill', 'none');
      const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconPath.setAttribute('d', 'M6 2h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm3 13h2');
      iconPath.setAttribute('stroke', '#b0b0b0');
      iconPath.setAttribute('stroke-width', '1.5');
      iconPath.setAttribute('stroke-linecap', 'round');
      icon.appendChild(iconPath);

      const span = document.createElement('span');
      span.textContent = brand;
      span.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      left.appendChild(icon);
      left.appendChild(span);
      row.appendChild(left);
      row.appendChild(arrow);
      li.appendChild(row);

      li.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; renderModelContent(centerContainer, rightContainer, farRightContainer, brand, data.modelsByBrand, data); });
      li.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      // РћСЃС‚Р°РІРёРј РєР»РёРє Р±РµР· Р·Р°РєСЂС‹С‚РёСЏ РѕРєРЅР° РЅР° Р±СѓРґСѓС‰РµРµ
      li.addEventListener('click', (e) => { e.stopPropagation(); renderModelContent(centerContainer, rightContainer, farRightContainer, brand, data.modelsByBrand, data); });

      list.appendChild(li);
    });

    panel.appendChild(list);
    return panel;
  }

  function renderModelContent(centerContainer, rightContainer, farRightContainer, brand, modelsByBrand, data) {
    centerContainer.innerHTML = '';
    centerContainer.style.border = '0';
    centerContainer.style.background = '#fff';
    centerContainer.style.minHeight = '220px';
    centerContainer.style.padding = '8px';
    
    // Hide right panels when switching brands
    rightContainer.style.display = 'none';
    farRightContainer.style.display = 'none';

    requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });

    const models = modelsByBrand[brand] || ['РњРѕРґРµР»СЊ РЅРµРґРѕСЃС‚СѓРїРЅР°'];

    const title = document.createElement('div');
    title.textContent = t('model_title', 'РњРѕРґРµР»СЊ');
    title.style.fontWeight = '600';
    title.style.margin = '6px';
    title.classList.add('catalog-panel-title');
    centerContainer.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '6px';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';

    models.forEach(modelName => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.borderRadius = '12px';
      row.style.background = '#fff';
      row.style.cursor = 'pointer';
      row.style.border = '0';
      row.style.transition = 'background 120ms ease';

      const label = document.createElement('span');
      label.textContent = modelName;
      label.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      row.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; renderRAMContent(rightContainer, farRightContainer, brand, modelName, data.ramOptions, data); });
      row.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      row.addEventListener('click', (e) => { e.stopPropagation(); renderRAMContent(rightContainer, farRightContainer, brand, modelName, data.ramOptions, data); });

      row.appendChild(label);
      row.appendChild(arrow);
      li.appendChild(row);
      list.appendChild(li);
    });

    centerContainer.appendChild(list);
  }

  function renderRAMContent(container, storageContainer, brand, model, ramOptions, data) {
    container.innerHTML = '';
    container.style.display = 'block';
    storageContainer.style.display = 'none';
    requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });
    
    const title = document.createElement('div');
    title.textContent = t('ram_title', 'РћР—РЈ');
    title.style.fontWeight = '600';
    title.style.margin = '6px';
    title.classList.add('catalog-panel-title');
    container.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '6px';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';

    ramOptions.forEach(ramSize => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.borderRadius = '12px';
      row.style.background = '#fff';
      row.style.cursor = 'pointer';
      row.style.border = '0';
      row.style.transition = 'background 120ms ease';

      const label = document.createElement('span');
      label.textContent = ramSize;
      label.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      row.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; renderStorageContent(storageContainer, brand, model, ramSize, data.storageOptions); });
      row.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      row.addEventListener('click', (e) => { e.stopPropagation(); renderStorageContent(storageContainer, brand, model, ramSize, data.storageOptions); });

      row.appendChild(label);
      row.appendChild(arrow);
      li.appendChild(row);
      list.appendChild(li);
    });

    container.appendChild(list);
  }

  function renderStorageContent(container, brand, model, ram, storageOptions) {
    container.innerHTML = '';
    container.style.display = 'block';
    requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });
    
    const title = document.createElement('div');
    title.textContent = t('storage_title', 'РџР°РјСЏС‚СЊ');
    title.style.fontWeight = '600';
    title.style.margin = '6px';
    title.classList.add('catalog-panel-title');
    container.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '6px';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';

    storageOptions.forEach(storageSize => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.borderRadius = '12px';
      row.style.background = '#fff';
      row.style.cursor = 'pointer';
      row.style.border = '0';
      row.style.transition = 'background 120ms ease';

      const label = document.createElement('span');
      label.textContent = storageSize;
      label.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      row.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; });
      row.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      row.addEventListener('click', (e) => { e.stopPropagation(); /* placeholder: next step (color/condition) */ });

      row.appendChild(label);
      row.appendChild(arrow);
      li.appendChild(row);
      list.appendChild(li);
    });

    container.appendChild(list);
  }

  // ---------- Accessories flow: Category -> Subcategory ----------
  function renderAccessoriesFlow() {
    const container = document.getElementById('catalogMegaContent');
    if (!container) return;
    container.innerHTML = '';
    container.style.paddingTop = '8px';

    const layout = document.createElement('div');
    layout.style.display = 'flex';
    layout.style.gap = '16px';
    layout.style.alignItems = 'flex-start';

    const center = document.createElement('div');
    center.id = 'catalogCenterContent';
    center.classList.add('catalog-column');
    center.style.flex = '0 0 420px';
    center.style.width = '420px';
    center.style.minHeight = '200px';
    center.style.borderRadius = '12px';
    center.style.background = '#fff';
    center.style.border = '0';
    center.style.padding = '8px';

    loadAccessoriesData().then(data => {
      const left = renderAccessoryCategoryPanel(center, data.categories || {});
      left.classList.add('catalog-column');
      layout.appendChild(left);
      layout.appendChild(center);
      container.appendChild(layout);
      requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });
    });
  }

  function renderAccessoryCategoryPanel(centerContainer, categoriesObj) {
    const panel = document.createElement('div');
    panel.style.width = '320px';
    panel.style.maxWidth = '100%';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.border = '0';
    panel.style.borderRadius = '12px';
    panel.style.background = '#fff';
    panel.style.padding = '8px';
    panel.classList.add('catalog-column');

    const title = document.createElement('div');
    title.textContent = t('accessories_category_title', 'РљР°С‚РµРіРѕСЂРёСЏ Р°РєСЃРµСЃСЃСѓР°СЂРѕРІ');
    title.style.fontWeight = '600';
    title.style.margin = '0 0 8px';
    title.classList.add('catalog-panel-title');
    panel.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '0';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';
    list.style.maxHeight = '60vh';
    list.style.overflow = 'auto';
    Object.keys(categoriesObj).forEach(category => {
      const li = document.createElement('li');
      li.style.position = 'relative';
      li.style.borderRadius = '10px';
      li.style.background = '#fff';
      li.style.cursor = 'pointer';

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.border = '0';
      row.style.borderRadius = '12px';
      row.style.transition = 'background 120ms ease';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '10px';

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      icon.setAttribute('width', '18');
      icon.setAttribute('height', '18');
      icon.setAttribute('viewBox', '0 0 20 20');
      icon.setAttribute('fill', 'none');
      const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconPath.setAttribute('d', 'M4 6h12M4 10h12M4 14h12');
      iconPath.setAttribute('stroke', '#b0b0b0');
      iconPath.setAttribute('stroke-width', '1.5');
      iconPath.setAttribute('stroke-linecap', 'round');
      icon.appendChild(iconPath);

      const span = document.createElement('span');
      span.textContent = category;
      span.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      left.appendChild(icon);
      left.appendChild(span);
      row.appendChild(left);
      row.appendChild(arrow);
      li.appendChild(row);

      li.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; renderAccessorySubcategories(centerContainer, category, categoriesObj); });
      li.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      li.addEventListener('click', (e) => { e.stopPropagation(); renderAccessorySubcategories(centerContainer, category, categoriesObj); });

      list.appendChild(li);
    });

    panel.appendChild(list);
    return panel;
  }

  function renderAccessorySubcategories(centerContainer, category, categoriesObj) {
    centerContainer.innerHTML = '';

    const categoryData = categoriesObj[category] || {
      'РўРѕРІР°СЂС‹': ['РќРµС‚ РґР°РЅРЅС‹С…']
    };

    const title = document.createElement('div');
    title.textContent = category.toUpperCase();
    title.style.fontWeight = '700';
    title.style.fontSize = '18px';
    title.style.color = '#111';
    title.style.margin = '0 0 20px 0';
    title.style.letterSpacing = '0.5px';
    centerContainer.appendChild(title);

    // РЎРѕР·РґР°РµРј СЃРµС‚РєСѓ РєРѕР»РѕРЅРѕРє
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '30px';

    Object.keys(categoryData).forEach(subcat => {
      const column = document.createElement('div');
      
      const columnTitle = document.createElement('div');
      columnTitle.textContent = subcat;
      columnTitle.style.fontWeight = '600';
      columnTitle.style.fontSize = '16px';
      columnTitle.style.color = '#212529';
      columnTitle.style.marginBottom = '15px';
      column.appendChild(columnTitle);

      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.margin = '0';
      list.style.padding = '0';

      categoryData[subcat].forEach(item => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        
        const link = document.createElement('span');
        link.textContent = item;
        link.style.fontSize = '14px';
        link.style.color = '#495057';
        link.style.cursor = 'pointer';
        link.style.transition = 'color 0.2s ease';
        
        link.addEventListener('mouseenter', () => {
          link.style.color = '#f5c400';
          link.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', () => {
          link.style.color = '#495057';
          link.style.textDecoration = 'none';
        });
        
        li.appendChild(link);
        list.appendChild(li);
      });

      column.appendChild(list);
      grid.appendChild(column);
    });

    centerContainer.appendChild(grid);
    requestAnimationFrame(updateMegaWidth);
  }

  // ---------- Parts flow: Category -> Brand -> Model ----------
  function renderPartsFlow() {
    const container = document.getElementById('catalogMegaContent');
    if (!container) return;
    container.innerHTML = '';
    container.style.paddingTop = '8px';

    const layout = document.createElement('div');
    layout.style.display = 'flex';
    layout.style.gap = '16px';
    layout.style.alignItems = 'flex-start';

    const center = document.createElement('div');
    center.id = 'catalogCenterContent';
    center.classList.add('catalog-column');
    center.style.flex = '0 0 280px';
    center.style.width = '280px';
    center.style.minHeight = '200px';
    center.style.borderRadius = '12px';
    center.style.background = '#fff';
    center.style.border = '0';
    center.style.padding = '8px';

    const right = document.createElement('div');
    right.id = 'catalogRightContent';
    right.classList.add('catalog-column');
    right.style.flex = '0 0 240px';
    right.style.width = '240px';
    right.style.minHeight = '200px';
    right.style.borderRadius = '12px';
    right.style.background = '#fff';
    right.style.border = '0';
    right.style.padding = '8px';
    right.style.display = 'none';

    loadPartsData().then(data => {
      const left = renderPartsCategoryPanel(center, right, data.partTypes, data);
      left.classList.add('catalog-column');
      layout.appendChild(left);
      layout.appendChild(center);
      layout.appendChild(right);
      container.appendChild(layout);
      requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });
    });
  }

  function renderPartsCategoryPanel(centerContainer, rightContainer, partTypes, data) {
    const panel = document.createElement('div');
    panel.style.width = '320px';
    panel.style.maxWidth = '100%';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.border = '0';
    panel.style.borderRadius = '12px';
    panel.style.background = '#fff';
    panel.style.padding = '8px';
    panel.classList.add('catalog-column');

    const title = document.createElement('div');
    title.textContent = t('parts_type_title', 'РўРёРї Р·Р°РїС‡Р°СЃС‚Рё');
    title.style.fontWeight = '600';
    title.style.margin = '0 0 8px';
    title.classList.add('catalog-panel-title');
    panel.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '0';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';
    list.style.maxHeight = '60vh';
    list.style.overflow = 'auto';

    partTypes.forEach(partType => {
      const li = document.createElement('li');
      li.style.position = 'relative';
      li.style.borderRadius = '10px';
      li.style.background = '#fff';
      li.style.cursor = 'pointer';

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.border = '0';
      row.style.borderRadius = '12px';
      row.style.transition = 'background 120ms ease';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '10px';

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      icon.setAttribute('width', '18');
      icon.setAttribute('height', '18');
      icon.setAttribute('viewBox', '0 0 20 20');
      icon.setAttribute('fill', 'none');
      const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconPath.setAttribute('d', 'M4 4h12v12H4z');
      iconPath.setAttribute('stroke', '#b0b0b0');
      iconPath.setAttribute('stroke-width', '1.5');
      iconPath.setAttribute('stroke-linecap', 'round');
      icon.appendChild(iconPath);

      const span = document.createElement('span');
      span.textContent = partType;
      span.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      left.appendChild(icon);
      left.appendChild(span);
      row.appendChild(left);
      row.appendChild(arrow);
      li.appendChild(row);

      li.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; renderPartsBrands(centerContainer, rightContainer, partType, data.brands, data.modelsByBrand); });
      li.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      li.addEventListener('click', (e) => { e.stopPropagation(); renderPartsBrands(centerContainer, rightContainer, partType, data.brands, data.modelsByBrand); });

      list.appendChild(li);
    });

    panel.appendChild(list);
    return panel;
  }

  function renderPartsBrands(centerContainer, rightContainer, partType, brands, modelsByBrand) {
    centerContainer.innerHTML = '';
    centerContainer.style.border = '0';
    centerContainer.style.background = '#fff';
    centerContainer.style.minHeight = '220px';
    centerContainer.style.padding = '8px';
    
    rightContainer.style.display = 'none';
    requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });

    const title = document.createElement('div');
    title.textContent = 'Р‘СЂРµРЅРґ РґР»СЏ ' + partType;
    title.style.fontWeight = '600';
    title.style.margin = '6px';
    centerContainer.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '6px';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';

    brands.forEach(brand => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '12px 14px';
      row.style.borderRadius = '12px';
      row.style.background = '#fff';
      row.style.cursor = 'pointer';
      row.style.border = '0';
      row.style.transition = 'background 120ms ease';

      const label = document.createElement('span');
      label.textContent = brand;
      label.style.color = '#222';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrow.setAttribute('width', '16');
      arrow.setAttribute('height', '16');
      arrow.setAttribute('viewBox', '0 0 20 20');
      const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M7 4l6 6-6 6');
      arrowPath.setAttribute('fill', 'none');
      arrowPath.setAttribute('stroke', '#b0b0b0');
      arrowPath.setAttribute('stroke-width', '1.8');
      arrowPath.setAttribute('stroke-linecap', 'round');
      arrowPath.setAttribute('stroke-linejoin', 'round');
      arrow.appendChild(arrowPath);
      arrow.style.visibility = 'hidden';
      arrow.classList.add('arrow-icon');

      row.addEventListener('mouseenter', () => { arrow.style.visibility = 'visible'; row.style.background = '#fafafa'; renderPartsModels(rightContainer, partType, brand, modelsByBrand); });
      row.addEventListener('mouseleave', () => { arrow.style.visibility = 'hidden'; row.style.background = '#fff'; });
      row.addEventListener('click', (e) => { e.stopPropagation(); renderPartsModels(rightContainer, partType, brand, modelsByBrand); });

      row.appendChild(label);
      row.appendChild(arrow);
      li.appendChild(row);
      list.appendChild(li);
    });

    centerContainer.appendChild(list);
  }

  function renderPartsModels(rightContainer, partType, brand, modelsByBrand) {
    rightContainer.innerHTML = '';
    rightContainer.style.display = 'block';
    requestAnimationFrame(() => { updateMegaWidth(); updateColumnDividers(); });

    const models = modelsByBrand[brand] || ['РњРѕРґРµР»СЊ РЅРµРґРѕСЃС‚СѓРїРЅР°'];

    const title = document.createElement('div');
    title.textContent = `${partType} РґР»СЏ ${brand}`;
    title.style.fontWeight = '600';
    title.style.margin = '6px';
    rightContainer.appendChild(title);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.margin = '0';
    list.style.padding = '6px';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';

    models.forEach(model => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.padding = '12px 14px';
      row.style.borderRadius = '12px';
      row.style.background = '#fff';
      row.style.cursor = 'pointer';
      row.style.border = '0';
      row.style.transition = 'background 120ms ease';

      const label = document.createElement('span');
      label.textContent = model;
      label.style.color = '#222';

      row.addEventListener('mouseenter', () => { row.style.background = '#fafafa'; });
      row.addEventListener('mouseleave', () => { row.style.background = '#fff'; });
      row.addEventListener('click', (e) => { e.stopPropagation(); /* Р—РґРµСЃСЊ РјРѕР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ РїРµСЂРµС…РѕРґ Рє С‚РѕРІР°СЂР°Рј */ });

      row.appendChild(label);
      li.appendChild(row);
      list.appendChild(li);
    });

    rightContainer.appendChild(list);
  }

  
});
