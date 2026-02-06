// Р•РґРёРЅСЃС‚РІРµРЅРЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє СЂР°Р·РјРµС‚РєРё С…РµРґРµСЂР°. Р’СЃС‚СЂР°РёРІР°РµС‚ РѕР±С‰РёР№ С…РµРґРµСЂ РЅР° РІСЃРµС… СЃС‚СЂР°РЅРёС†Р°С….
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('app-header') || document.querySelector('header');
  if (!mount) return;

  const isSubpage = window.location.pathname.indexOf('/html/') !== -1;
  const prefix = isSubpage ? '../' : '';
  const linkIndex = isSubpage ? '../index.html' : 'index.html';
  const linkAccessories = isSubpage ? 'accessories.html' : 'html/accessories.html';
  const linkParts = isSubpage ? 'parts.html' : 'html/parts.html';

  // РћРїСЂРµРґРµР»СЏРµРј С‚РµРєСѓС‰СѓСЋ РєР°С‚РµРіРѕСЂРёСЋ РґР»СЏ Р»РѕРєР°Р»РёР·Р°С†РёРё РєРЅРѕРїРєРё РєР°С‚Р°Р»РѕРіР°
  const path = (window.location.pathname || '').toLowerCase();
  let catalogI18n = 'catalog_button_smartphones';
  if (path.indexOf('accessories') !== -1) catalogI18n = 'catalog_button_accessories';
  else if (path.indexOf('parts') !== -1) catalogI18n = 'catalog_button_parts';

  mount.innerHTML = `
    <div class="top-control-panel">
      <div class="container-top-control-panel">
        <div class="top-control">
          <div class="top-left">
            <div class="location-user">
              <button class="main-btn-location-user" data-modal-target="locationModal" data-i18n="location_all_country">
                <svg class="icon-location" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="white"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                <span class="i18n-text" data-i18n-text>Р’СЃСЏ СЃС‚СЂР°РЅР°</span>
              </button>

              <div class="modal-overlay-location" id="locationModal" style="display:none;">
                <div class="content-location-block">
                  <button class="btn-close-modal-location" data-modal-close>&times;</button>
                  <p class="text-your-location" data-i18n="your_location">Р’Р°С€Рµ РјРµСЃС‚РѕРїРѕР»РѕР¶РµРЅРёРµ</p>
                  <label for="regionSelect" class="text-region" data-i18n="region_label">РћР±Р»Р°СЃС‚СЊ</label>
                  <select id="regionSelect"><option value="" data-i18n="region_label">РћР±Р»Р°СЃС‚СЊ</option></select>
                  <label for="citySelect" class="text-city" data-i18n="city_label">Р“РѕСЂРѕРґ</label>
                  <select id="citySelect"><option value="" data-i18n="city_label">Р“РѕСЂРѕРґ</option></select>
                  <button class="btn-Identify-locations" data-i18n="detect_location_btn">РћРїСЂРµРґРµР»РёС‚СЊ РјРµСЃС‚РѕРїРѕР»РѕР¶РµРЅРёСЏ</button>
                  <div class="location-actions">
                    <button class="btn-all-country" data-i18n="location_all_country">Р’СЃСЏ СЃС‚СЂР°РЅР°</button>
                    <button class="btn-choose-location" data-i18n="choose_btn">Р’С‹Р±СЂР°С‚СЊ</button>
                  </div>
                </div>
              </div>

              <div class="modal-overlay-delivery" id="deliveryModal" style="display:none;">
                <div class="content-delivery-block">
                  <button class="btn-close-modal-location" data-modal-close>&times;</button>
                  <div class="delivery-title" data-i18n="delivery_title">Р”РѕСЃС‚Р°РІРєР°</div>
                  <div class="delivery-options">
                    <div class="delivery-option">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#f5c400"><path d="M120-200v-560h560v80H200v400h400v80H120Zm560 0v-120q0-17 11.5-28.5T720-360h120l120 160H680Zm80-40h56l-45-60h-11v60Zm-60-160v-360h200v360H700Zm80-80h40v-200h-40v200Z"/></svg>
                      <div>
                        <div><strong data-i18n="delivery_pickup">РЎР°РјРѕРІС‹РІРѕР·</strong></div>
                        <div class="delivery-note" data-i18n="delivery_pickup_note">Р—Р°Р±РµСЂРёС‚Рµ Р·Р°РєР°Р· РёР· РїСѓРЅРєС‚Р° РІС‹РґР°С‡Рё</div>
                      </div>
                    </div>
                    <div class="delivery-option">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#f5c400"><path d="M280-160q-50 0-85-35t-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z"/></svg>
                      <div>
                        <div><strong data-i18n="delivery_courier">РљСѓСЂСЊРµСЂРѕРј</strong></div>
                        <div class="delivery-note" data-i18n="delivery_courier_note">Р”РѕСЃС‚Р°РІРєР° РїРѕ РіРѕСЂРѕРґСѓ РІ С‚РµС‡РµРЅРёРµ 1-2 РґРЅРµР№</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="delivery">
              <a class="ads-delivery" href="#" data-modal-target="deliveryModal" data-i18n="delivery_link">
                <svg class="icon-delivery" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="white"><path d="M280-160q-50 0-85-35t-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35Zm357-280h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z"/></svg>
                <span class="i18n-text" data-i18n-text>Р”РѕСЃС‚Р°РІРєР°</span>
              </a>
            </div>
          </div>

          <div class="top-center">
            <div class="categories">
              <div class="category-smartphones">
                <a class="ads-smartphones${path.indexOf('accessories') === -1 && path.indexOf('parts') === -1 ? ' active' : ''}" href="${linkIndex}">
                  <svg class="icon-smartphone" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="white"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-40q17 0 28.5-11.5T520-200q0-17-11.5-28.5T480-240q-17 0-28.5 11.5T440-200q0 17 11.5 28.5T480-160Z"/></svg>
                  <span data-i18n="category_smartphones">РЎРјР°СЂС‚С„РѕРЅС‹</span>
                </a>
              </div>
              <div class="category-accessories">
                <a class="ads-accessories${path.indexOf('accessories') !== -1 ? ' active' : ''}" href="${linkAccessories}">
                  <svg class="icon-accessories" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="white"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z"/></svg>
                  <span data-i18n="category_accessories">РђРєСЃРµСЃСЃСѓР°СЂС‹</span>
                </a>
              </div>
              <div class="category-parts">
                <a class="ads-parts${path.indexOf('parts') !== -1 ? ' active' : ''}" href="${linkParts}">
                  <svg class="icon-parts" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="white"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114t28.5 140.5q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q50 0 95-19t77-54q33-35 52-80t19-95q0-50-19-95t-52-80q-33-35-77-54t-95-19q-50 0-95 19t-77 54q-33 35-52 80t-19 95q0 50 19 95t52 80q33 35 77 54t95 19Zm0-120q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Z"/></svg>
                  <span data-i18n="category_parts">Р—Р°РїС‡Р°СЃС‚Рё</span>
                </a>
              </div>
            </div>
          </div>

          <div class="top-right">
            <div class="notifications">
              <button class="notify-btn" aria-haspopup="true" aria-expanded="false" title="РЈРІРµРґРѕРјР»РµРЅРёСЏ" data-i18n-title="notifications_btn_title">
                <svg class="icon-bell" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
                <span class="notify-badge" id="notifyBadge" hidden></span>
              </button>
              <div class="notify-dropdown" id="notifyDropdown" hidden>
                <div class="notify-header" data-i18n="notifications_title">РЈРІРµРґРѕРјР»РµРЅРёСЏ</div>
                <ul class="notify-list" id="notifyList">
                  <li class="notify-empty" data-i18n="notifications_empty">РќРµС‚ СѓРІРµРґРѕРјР»РµРЅРёР№</li>
                </ul>
              </div>
            </div>
            <div class="lang-switcher">
              <button id="langBtn" aria-haspopup="listbox" aria-expanded="false">
                <img id="langFlag" src="${prefix}img/flag/ru.svg" class="lang-flag-main" alt="RU" />
                <span id="langLabel" class="lang-label">Р СѓСЃСЃРєРёР№</span>
              </button>
              <div id="langDropdown" class="lang-dropdown">
                <button data-lang="ru" data-flag="${prefix}img/flag/ru.svg"><img src="${prefix}img/flag/ru.svg" class="lang-flag" alt="RU" /> Р СѓСЃСЃРєРёР№</button>
                <button data-lang="uz" data-flag="${prefix}img/flag/uz.svg"><img src="${prefix}img/flag/uz.svg" class="lang-flag" alt="UZ" /> O'zbekcha</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-header-wrapper">
      <div class="main-header">
        <div class="logo">
          <a href="${linkIndex}"><span class="logo-text" data-i18n="logo_text">Mobile Elon</span></a>
        </div>
        <div class="catalog-search-group">
          <button class="catalog-btn" data-i18n="${catalogI18n}">
            <svg class="icon-catalog" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="white"><rect x="2" y="4" width="16" height="2" rx="1"/><rect x="2" y="9" width="16" height="2" rx="1"/><rect x="2" y="14" width="16" height="2" rx="1"/></svg>
            <span class="i18n-text" data-i18n-text></span>
          </button>
          <form class="search-form" action="#" method="get">
            <input type="text" class="search-input" placeholder="РџРѕРёСЃРє..." name="q" data-i18n-placeholder="search_placeholder" />
            <button type="submit" class="search-btn">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="7" stroke="white" stroke-width="2" /><line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="white" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </form>
        </div>
        <div class="header-actions-compact" id="headerGuest">
          <button class="btn-login" data-modal-target="authModal" data-i18n="login_button">
            <svg class="icon-login" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 21c0-4.418 4.03-8 9-8s9 3.582 9 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="btn-label" data-i18n-text>Р’С…РѕРґ</span>
          </button>
        </div>
        <div class="user-profile" id="headerUser" style="display:none;">
          <button class="user-profile-btn" title="РџСЂРѕС„РёР»СЊ" data-i18n-title="profile_button_title">
            <span class="user-chip">
              <span class="user-avatar" aria-hidden="true">
                <svg class="icon-user" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
              </span>
              <span class="user-info-inline">
                <span class="user-name-inline" id="userNameInline">РРјСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ</span>
                <span class="user-meta-inline">
                  <span class="user-balance-inline"><span data-i18n="balance_label">Р‘Р°Р»Р°РЅСЃ</span>: <span id="balanceAmountInline">0</span></span>
                  <span class="user-verified-badge" id="userVerifiedBadge" title="Р’РµСЂРёС„РёС†РёСЂРѕРІР°РЅРЅС‹Р№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ" data-i18n-title="profile_verified_title">
                    <svg class="icon-verified-badge" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#4caf50"/>
                      <path d="M7 12l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </span>
                <span class="user-verify-inline" id="userVerifyInline"></span>
              </span>
            </span>
          </button>
          <div class="profile-dropdown">
            <div class="profile-info">
              <div class="profile-name">РРјСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
                <span class="profile-verified" title="Р’РµСЂРёС„РёС†РёСЂРѕРІР°РЅРЅС‹Р№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ" data-i18n-title="profile_verified_title">
                  <svg class="icon-verified" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4caf50"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
              <div class="profile-email">user@email.com</div>
              <div class="profile-balance"><span data-i18n="balance_label">Р‘Р°Р»Р°РЅСЃ</span>: <span id="balanceAmount">0</span> <span class="currency" data-i18n="currency_sum">СЃСѓРј</span></div>
              <div class="profile-verify-state">
                <span id="verifyStateIcon"></span>
                <span id="verifyStateText"></span>
              </div>
            </div>
            <ul class="profile-menu">
              <li><a href="#" data-modal-target="profileModal" data-i18n="profile_my">РњРѕР№ РїСЂРѕС„РёР»СЊ</a></li>
              <li><a href="#" data-modal-target="myadsModal" data-i18n="my_ads">РњРѕРё РѕР±СЉСЏРІР»РµРЅРёСЏ</a></li>
              <li><a href="#" data-modal-target="favoritesModal" data-i18n="favourites_button">РР·Р±СЂР°РЅРЅРѕРµ</a></li>
              <li><a href="#" data-i18n="profile_logout">Р’С‹Р№С‚Рё</a></li>
            </ul>
          </div>
        </div>
        <div class="favourites"></div>
        <div class="header-actions-right">
          <button class="btn-header-chat" data-modal-target="chatModal" data-i18n="chat_button" title="Р§Р°С‚">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240l-160 160Zm126-240h594v-480H160v525l46-45Z"/></svg>
            <span class="chat-label" data-i18n-text>Р§Р°С‚</span>
          </button>
          <button class="btn-submit-ads" data-modal-target="authModal" data-i18n="submit_ads_button">
            <svg class="icon-plus" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="white"><path d="M440-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h240v-240q0-17 11.5-28.5T480-800q17 0 28.5 11.5T520-760v240h240q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H520v240q0 17-11.5 28.5T480-160q-17 0-28.5-11.5T440-200v-240Z"/></svg>
            РџРѕРґР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ
          </button>
        </div>
      </div>
    </div>
  `;
  // Р’СЃС‚Р°РІР»СЏРµРј РјРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ Р°РІС‚РѕСЂРёР·Р°С†РёРё РІ РєРѕРЅРµС† header
  if (!document.getElementById('authModal')) {
    const authModalHtml = `
      <div class="modal-overlay-auth" id="authModal" style="display:none;">
        <div class="content-auth-block">
          <button class="btn-close-modal-location" data-modal-close>&times;</button>
          <div class="auth-title" data-i18n="auth_title_login">Р’РѕР№С‚Рё</div>
          <div class="auth-tabs">
            <button class="auth-tab active" data-auth-tab="login" data-i18n="auth_tab_login">Р’РѕР№С‚Рё</button>
            <button class="auth-tab" data-auth-tab="register" data-i18n="auth_tab_register">Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ</button>
          </div>
          <div class="auth-view auth-view-login active">
            <div class="auth-phone">
              <input type="tel" placeholder="РўРµР»РµС„РѕРЅ" data-i18n-placeholder="auth_phone_placeholder" />
              <button class="auth-submit" data-i18n="auth_continue_phone">РџСЂРѕРґРѕР»Р¶РёС‚СЊ РїРѕ РЅРѕРјРµСЂСѓ</button>
            </div>
            <div class="auth-divider" data-i18n="auth_or">РёР»Рё</div>
            <div class="auth-providers">
              <button class="auth-provider auth-google" data-i18n="auth_continue_google">Р’РѕР№С‚Рё С‡РµСЂРµР· Google</button>
              <button class="auth-provider auth-telegram" data-i18n="auth_continue_telegram">Р’РѕР№С‚Рё С‡РµСЂРµР· Telegram</button>
            </div>
          </div>
          <div class="auth-view auth-view-register">
            <div class="auth-phone">
              <input type="tel" placeholder="РўРµР»РµС„РѕРЅ" data-i18n-placeholder="auth_phone_placeholder" />
              <button class="auth-submit" data-i18n="auth_register_phone">Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ</button>
            </div>
            <div class="auth-divider" data-i18n="auth_or">РёР»Рё</div>
            <div class="auth-providers">
              <button class="auth-provider auth-google" data-i18n="auth_continue_google">Google</button>
              <button class="auth-provider auth-telegram" data-i18n="auth_continue_telegram">Telegram</button>
            </div>
          </div>
        </div>
      </div>
    `;
    mount.insertAdjacentHTML('beforeend', authModalHtml);
  }

  
  // РњРѕРґР°Р»РєРё РёР· РјРµРЅСЋ РїСЂРѕС„РёР»СЏ: РњРѕР№ РїСЂРѕС„РёР»СЊ / РР·Р±СЂР°РЅРЅРѕРµ / Р§Р°С‚
  if (!document.getElementById('profileModal')) {
    const profileHtml = `
      <div class="modal-overlay-auth" id="profileModal" style="display:none;">
        <div class="content-auth-block">
          <button class="btn-close-modal-location" data-modal-close>&times;</button>
          <div class="auth-title" data-i18n="profile_my">РњРѕР№ РїСЂРѕС„РёР»СЊ</div>
          <div class="profile-modal-body" style="text-align:left;">
            <div id="profileModalBody"></div>
          </div>
        </div>
      </div>
    `;
    mount.insertAdjacentHTML('beforeend', profileHtml);
  }

  if (!document.getElementById('favoritesModal')) {
    const favHtml = `
      <div class="modal-overlay-auth" id="favoritesModal" style="display:none;">
        <div class="content-auth-block">
          <button class="btn-close-modal-location" data-modal-close>&times;</button>
          <div class="auth-title" data-i18n="favourites_button">РР·Р±СЂР°РЅРЅРѕРµ</div>
          <div class="profile-modal-body" style="text-align:left;">
            <div id="favoritesModalBody"></div>
          </div>
        </div>
      </div>
    `;
    mount.insertAdjacentHTML('beforeend', favHtml);
  }

  if (!document.getElementById('myadsModal')) {
    const myadsHtml = `
      <div class="modal-overlay-auth" id="myadsModal" style="display:none;">
        <div class="content-auth-block">
          <button class="btn-close-modal-location" data-modal-close>&times;</button>
          <div class="auth-title" data-i18n="my_ads">РњРѕРё РѕР±СЉСЏРІР»РµРЅРёСЏ</div>
          <div class="profile-modal-body" style="text-align:left;">
            <div id="myadsModalBody"></div>
          </div>
        </div>
      </div>
    `;
    mount.insertAdjacentHTML('beforeend', myadsHtml);
  }

  if (!document.getElementById('chatModal')) {
    const chatHtml = `
      <div class="modal-overlay-auth" id="chatModal" style="display:none;">
        <div class="content-auth-block">
          <button class="btn-close-modal-location" data-modal-close>&times;</button>
          <div class="auth-title" data-i18n="chat_button">Р§Р°С‚</div>
          <div class="profile-modal-body" style="text-align:left;">
            <div id="chatModalBody"></div>
          </div>
        </div>
      </div>
    `;
    mount.insertAdjacentHTML('beforeend', chatHtml);
  }

// Р’СЃС‚Р°РІР»СЏРµРј РјРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ РїРѕРґР°С‡Рё РѕР±СЉСЏРІР»РµРЅРёСЏ, РµСЃР»Рё РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚
  if (!document.getElementById('submitAdsModal')) {
    const submitAdsHtml = `
      <div class="modal-overlay-submit-ads" id="submitAdsModal" style="display:none;">
        <div class="content-submit-ads-block">
          <button class="btn-close-modal-submit-ads" data-modal-close>&times;</button>
          <div class="submit-ads-title" data-i18n="submit_ads_title">РџРѕРґР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ</div>
          <div class="submit-ads-content">
            <p data-i18n="submit_ads_form_soon">Р¤РѕСЂРјР° РїРѕРґР°С‡Рё РѕР±СЉСЏРІР»РµРЅРёСЏ Р±СѓРґРµС‚ РґРѕР±Р°РІР»РµРЅР° РїРѕР·Р¶Рµ...</p>
          </div>
        </div>
      </div>
    `;
    mount.insertAdjacentHTML('beforeend', submitAdsHtml);
  }

  // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїРµСЂРµРєР»СЋС‡РµРЅРёСЏ РІРєР»Р°РґРѕРє (СЂР°Р±РѕС‚Р°РµС‚ Рё РґР»СЏ СЃС‚Р°С‚РёС‡РµСЃРєРѕР№ РјРѕРґР°Р»РєРё)
  (function initAuthTabsOnce() {
    const authEl = document.getElementById('authModal');
    if (!authEl || authEl.dataset.tabsInitialized === '1') return;
    const tabs = authEl.querySelectorAll('.auth-tab');
    const viewLogin = authEl.querySelector('.auth-view-login');
    const viewRegister = authEl.querySelector('.auth-view-register');
    const titleEl = authEl.querySelector('.auth-title');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-auth-tab');
        if (target === 'login') {
          viewLogin.classList.add('active');
          viewRegister.classList.remove('active');
          if (titleEl) {
            titleEl.textContent = (window.getTranslation ? window.getTranslation('auth_title_login') : 'Р’РѕР№С‚Рё');
          }
        } else {
          viewRegister.classList.add('active');
          viewLogin.classList.remove('active');
          if (titleEl) {
            titleEl.textContent = (window.getTranslation ? window.getTranslation('auth_title_register') : 'Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊ');
          }
        }
      });
    });
    authEl.dataset.tabsInitialized = '1';
  })();

  // РўРѕРіРіР» UI РґР»СЏ РіРѕСЃС‚СЏ/РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ Рё РїСЂРѕСЃС‚Р°СЏ РёРјРёС‚Р°С†РёСЏ РІС…РѕРґР°/РІС‹С…РѕРґР°
  (function initAuthToggle() {
    const guestBox = document.getElementById('headerGuest');
    const userBox = document.getElementById('headerUser');
    const submitBtn = document.querySelector('.btn-submit-ads');
    const verifyStateText = () => (localStorage.getItem('isVerified') === '1' ? (window.getTranslation ? window.getTranslation('verified_yes') : 'Р’РµСЂРёС„РёС†РёСЂРѕРІР°РЅ') : (window.getTranslation ? window.getTranslation('verified_no') : 'РќРµ РІРµСЂРёС„РёС†РёСЂРѕРІР°РЅ'));
    const verifyStateIconHtml = () => (localStorage.getItem('isVerified') === '1'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4caf50"/><path d="M7 12l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '');
    function getUserProfile() {
      try {
        const raw = localStorage.getItem('user_profile');
        const obj = raw ? JSON.parse(raw) : null;
        return obj && typeof obj === 'object' ? obj : {};
      } catch (e) { return {}; }
    }

    function setUserProfile(next) {
      try {
        const cur = getUserProfile();
        localStorage.setItem('user_profile', JSON.stringify({ ...cur, ...next }));
      } catch (e) {}
    }

    function ensureUserId() {
      const cur = getUserProfile();
      if (cur && cur.id) return cur.id;
      const id = 'u_' + String(Date.now()) + '_' + String(Math.floor(Math.random() * 1e6));
      setUserProfile({ id });
      return id;
    }

    function applyState() {
      const isAuth = localStorage.getItem('isAuth') === '1';
      if (guestBox) guestBox.style.display = isAuth ? 'none' : '';
      if (userBox) userBox.style.display = isAuth ? '' : 'none';
      if (submitBtn) submitBtn.setAttribute('data-modal-target', isAuth ? 'submitAdsModal' : 'authModal');
      // Р’РёР·СѓР°Р»РёР·Р°С†РёСЏ СЃС‚Р°С‚СѓСЃР° РІРµСЂРёС„РёРєР°С†РёРё РІ РґСЂРѕРїРґР°СѓРЅРµ
      const textEl = document.getElementById('verifyStateText');
      const iconEl = document.getElementById('verifyStateIcon');
      if (textEl && iconEl) {
        const verified = localStorage.getItem('isVerified') === '1';
        textEl.textContent = verified ? verifyStateText() : '';
        textEl.className = verified ? 'verify-yes' : 'verify-no';
        iconEl.innerHTML = verifyStateIconHtml();
      }

      // РРјСЏ/РєРѕРЅС‚Р°РєС‚ РІ С€Р°РїРєРµ
      const profile = getUserProfile();
      const name = (profile.name || '').trim() || (window.getTranslation ? window.getTranslation('profile_default_name') : 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ');
      const phone = (profile.phone || '').trim();
      const email = (profile.email || '').trim();
      const userNameInline = document.getElementById('userNameInline');
      if (userNameInline) userNameInline.textContent = name;
      const ddName = document.querySelector('.profile-info .profile-name');
      if (ddName) {
        // profile-name СЃРѕРґРµСЂР¶РёС‚ РёРєРѕРЅРєРё, РїРѕСЌС‚РѕРјСѓ РјРµРЅСЏРµРј С‚РѕР»СЊРєРѕ С‚РµРєСЃС‚РѕРІС‹Р№ СѓР·РµР»
        const firstText = ddName.childNodes && ddName.childNodes[0];
        if (firstText && firstText.nodeType === Node.TEXT_NODE) firstText.textContent = name;
      }
      const ddEmail = document.querySelector('.profile-info .profile-email');
      if (ddEmail) ddEmail.textContent = phone || email || 'user@email.com';
    }
    applyState();

    function t(key, fallback) {
      try { if (typeof window.getTranslation === 'function') return window.getTranslation(key) || fallback; } catch (e) {}
      return fallback;
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

    function money(n) {
      if (n === null || n === undefined) return '';
      const num = Number(n);
      if (!Number.isFinite(num)) return String(n);
      try { return num.toLocaleString(); } catch (e) { return String(num); }
    }

    function getSelectedLocationLabel() {
      try {
        const saved = localStorage.getItem('selected_location');
        if (!saved) return '';
        const obj = JSON.parse(saved);
        if (obj && (obj.city || obj.region)) {
          return [obj.city, obj.region].filter(Boolean).join(', ');
        }
      } catch (e) {}
      // РЅР° РІСЃСЏРєРёР№ СЃР»СѓС‡Р°Р№: РµСЃР»Рё РіРґРµ-С‚Рѕ Р·Р°РїРёСЃР°Р»Рё plain string
      try {
        const raw = localStorage.getItem('selected_location');
        if (raw && raw.indexOf('{') === -1) return raw;
      } catch (e) {}
      return '';
    }

    function maskPhone(phone) {
      const digits = String(phone || '').replace(/\D+/g, '');
      // Р”Р»СЏ UZ (РѕР±С‹С‡РЅРѕ 12 С†РёС„СЂ РЅР°С‡РёРЅР°СЏ СЃ 998)
      if (digits.length >= 12 && digits.startsWith('998')) {
        const a = digits.slice(0, 3);
        const b = digits.slice(3, 5);
        const c = digits.slice(5, 8);
        const d = digits.slice(8, 10);
        const e = digits.slice(10, 12);
        return `+${a} ${b} *** ** ${e}`;
      }
      // РћР±С‰Р°СЏ РјР°СЃРєР°
      if (digits.length >= 10) {
        const last2 = digits.slice(-2);
        return `+*** *** *** ** ${last2}`;
      }
      return String(phone || '');
    }

    function escapeHtml(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderProfileModal() {
      const box = document.getElementById('profileModalBody');
      if (!box) return;
      // РћРєРЅРѕ РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ РїСѓСЃС‚Рѕ
      box.innerHTML = '';
    }

    function getFavIds() {
      try {
        const raw = localStorage.getItem('favorite_ads');
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    }

    function renderFavoritesModal() {
      const box = document.getElementById('favoritesModalBody');
      if (!box) return;
      const favIds = getFavIds();
      let ads = [];
      try {
        const raw = localStorage.getItem('submitted_ads');
        ads = raw ? JSON.parse(raw) : [];
      } catch (e) { ads = []; }

      const favAds = ads.filter(a => favIds.includes(String(a.id || a.createdAt)));
      if (favAds.length === 0) {
        box.innerHTML = `<p data-i18n="favorites_empty">РџРѕРєР° РїСѓСЃС‚Рѕ.</p>`;
        return;
      }

      const items = favAds.map(a => {
        const title = a.title || '';
        const price = (typeof a.price === 'number') ? a.price.toLocaleString() : (a.price || '');
        return `
          <div style="display:flex; justify-content:space-between; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
            <div style="min-width:0;">
              <div style="font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${title}</div>
              <div style="opacity:.8; margin-top:2px;">${price}</div>
            </div>
            <button type="button" class="auth-submit" data-fav-remove="${String(a.id || a.createdAt)}" style="width:auto; padding:8px 10px;">${t('remove','РЈРґР°Р»РёС‚СЊ')}</button>
          </div>
        `;
      }).join('');
      box.innerHTML = `<div>${items}</div>`;
    }

    function renderMyadsModal() {
      const box = document.getElementById('myadsModalBody');
      if (!box) return;
      const isAuth = localStorage.getItem('isAuth') === '1';
      if (!isAuth) {
        box.innerHTML = `
          <p data-i18n="profile_guest_text">Р’РѕР№РґРёС‚Рµ, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РѕР±СЉСЏРІР»РµРЅРёСЏ.</p>
          <button class="auth-submit" type="button" data-modal-target="authModal" style="width:100%; margin-top:10px;">${t('auth_title_login','Р’РѕР№С‚Рё')}</button>
        `;
        return;
      }

      const userId = ensureUserId();
      const allAds = readAds();
      const myAds = allAds.filter(a => {
        if (a && a.sellerId) return String(a.sellerId) === String(userId);
        return true;
      });

      if (myAds.length === 0) {
        box.innerHTML = `<p data-i18n="profile_ads_empty" style="margin:0; opacity:.85;">РЈ РІР°СЃ РїРѕРєР° РЅРµС‚ РѕР±СЉСЏРІР»РµРЅРёР№.</p>`;
        return;
      }

      const items = myAds.slice()
        .sort((a, b) => Number(b.updatedAt || b.createdAt || 0) - Number(a.updatedAt || a.createdAt || 0))
        .map(a => {
          const id = String(a.id || a.createdAt || '');
          const title = String(a.title || '').trim() || t('untitled','Р‘РµР· РЅР°Р·РІР°РЅРёСЏ');
          const price = money(a.price);
          const status = String(a.status || 'published');
          const statusText = status === 'hidden'
            ? t('ad_status_hidden','РЎРЅСЏС‚Рѕ')
            : status === 'draft'
              ? t('ad_status_draft','Р§РµСЂРЅРѕРІРёРє')
              : t('ad_status_published','РћРїСѓР±Р»РёРєРѕРІР°РЅРѕ');
          const statusIcon = status === 'hidden' ? 'вљЄ' : status === 'draft' ? 'рџ•“' : 'рџџў';
          const canEdit = status !== 'hidden';
          return `
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; padding:12px 0; border-bottom:1px solid #eee;">
              <div style="min-width:0; flex:1;">
                <div style="font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${title}</div>
                <div style="margin-top:4px; opacity:.85; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                  <span style="font-weight:600;">${price} <span data-i18n="currency_sum">СЃСѓРј</span></span>
                  <span>${statusIcon} ${statusText}</span>
                </div>
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                <button type="button" class="auth-submit" data-myad-edit="${id}" ${canEdit ? '' : 'disabled'} style="width:auto; padding:8px 10px; font-size:13px;">${t('profile_edit','Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ')}</button>
                <button type="button" class="auth-submit" data-myad-hide="${id}" style="width:auto; padding:8px 10px; font-size:13px;">${t('profile_unpublish','РЎРЅСЏС‚СЊ')}</button>
              </div>
            </div>
          `;
        })
        .join('');
      box.innerHTML = `<div>${items}</div>`;
    }

    function renderChatModal() {
      const box = document.getElementById('chatModalBody');
      if (!box) return;
      box.innerHTML = `
        <p data-i18n="chat_empty">Р§Р°С‚С‹ РїРѕСЏРІСЏС‚СЃСЏ Р·РґРµСЃСЊ РїРѕСЃР»Рµ РїРµСЂРІРѕРіРѕ СЃРѕРѕР±С‰РµРЅРёСЏ.</p>
      `;
    }

    window.onModalOpened = function(modalId) {
      if (modalId === 'profileModal') renderProfileModal();
      if (modalId === 'favoritesModal') renderFavoritesModal();
      if (modalId === 'myadsModal') renderMyadsModal();
      if (modalId === 'chatModal') renderChatModal();
    };

    function openModal(id) {
      try { if (typeof window.openModalById === 'function') return window.openModalById(id); } catch (e) {}
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    }

    function closeModal(id) {
      try { if (typeof window.closeModalById === 'function') return window.closeModalById(id); } catch (e) {}
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    }

    function startEditAd(adId) {
      const list = readAds();
      const ad = list.find(a => String(a.id || a.createdAt || '') === String(adId));
      if (!ad) return;
      try {
        localStorage.setItem('edit_ad_id', String(adId));
        // draft РґР»СЏ С„РѕСЂРјС‹
        const draft = { ...ad };
        delete draft.updatedAt;
        delete draft.status;
        delete draft.id;
        delete draft.createdAt;
        localStorage.setItem('submit_draft', JSON.stringify(draft));
      } catch (e) {}
      closeModal('profileModal');
      openModal('submitAdsModal');
      try { document.dispatchEvent(new CustomEvent('submitads:edit', { detail: { id: String(adId) } })); } catch (e) {}
    }

    function hideAd(adId) {
      const list = readAds();
      const idx = list.findIndex(a => String(a.id || a.createdAt || '') === String(adId));
      if (idx === -1) return;
      list[idx] = { ...list[idx], status: 'hidden', updatedAt: Date.now() };
      writeAds(list);
      renderProfileModal();
      try { document.dispatchEvent(new CustomEvent('ads:changed')); } catch (e) {}
    }

    // РЈРґР°Р»РµРЅРёРµ РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ РІРЅСѓС‚СЂРё РјРѕРґР°Р»РєРё
    document.addEventListener('click', (e) => {
      const saveBtn = e.target.closest('[data-profile-save]');
      if (saveBtn) {
        const nameEl = document.getElementById('profileNameInput');
        const phoneEl = document.getElementById('profilePhoneInput');
        const name = nameEl ? String(nameEl.value || '').trim() : '';
        const phone = phoneEl ? String(phoneEl.value || '').trim() : '';
        if (name) setUserProfile({ name });
        if (phone) setUserProfile({ phone });
        applyState();
        const hint = document.getElementById('profileSaveHint');
        if (hint) {
          hint.style.display = '';
          hint.textContent = t('profile_saved_hint', 'РЎРѕС…СЂР°РЅРµРЅРѕ');
          setTimeout(() => { try { hint.style.display = 'none'; } catch (e) {} }, 1200);
        }
        return;
      }

      // РџСЂРѕС„РёР»СЊ: Р±С‹СЃС‚СЂС‹Рµ РґРµР№СЃС‚РІРёСЏ
      const scrollBtn = e.target.closest('[data-profile-scroll]');
      if (scrollBtn) {
        const target = scrollBtn.getAttribute('data-profile-scroll');
        if (target === 'myads') {
          const el = document.getElementById('profileMyAds');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      const logoutBtn = e.target.closest('[data-profile-logout]');
      if (logoutBtn) {
        localStorage.removeItem('isAuth');
        applyState();
        closeModal('profileModal');
        return;
      }

      // РњРѕРё РѕР±СЉСЏРІР»РµРЅРёСЏ: СЂРµРґР°РєС‚РёСЂРѕРІР°С‚СЊ / СЃРЅСЏС‚СЊ
      const editBtn = e.target.closest('[data-myad-edit]');
      if (editBtn) {
        const id = editBtn.getAttribute('data-myad-edit');
        startEditAd(id);
        return;
      }
      const hideBtn = e.target.closest('[data-myad-hide]');
      if (hideBtn) {
        const id = hideBtn.getAttribute('data-myad-hide');
        hideAd(id);
        return;
      }

      const btn = e.target.closest('[data-fav-remove]');
      if (!btn) return;
      const id = btn.getAttribute('data-fav-remove');
      try {
        const fav = getFavIds().filter(x => x !== id);
        localStorage.setItem('favorite_ads', JSON.stringify(fav));
      } catch (err) {}
      renderFavoritesModal();
      // С‚Р°РєР¶Рµ РѕР±РЅРѕРІРёРј СЃРѕСЃС‚РѕСЏРЅРёСЏ СЃРµСЂРґРµС‡РµРє РЅР° РєР°СЂС‚РѕС‡РєР°С…
      try { document.dispatchEvent(new CustomEvent('favorites:changed')); } catch (err) {}
    }, true);

    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        const btn = e.target.closest('.auth-submit');
        if (!btn) return;
        // РџРѕРїСЂРѕР±СѓРµРј РїСЂРѕС‡РёС‚Р°С‚СЊ С‚РµР»РµС„РѕРЅ РёР· Р°РєС‚РёРІРЅРѕР№ РІРєР»Р°РґРєРё
        try {
          const phoneInput = authModal.querySelector('.auth-view.active input[type="tel"]');
          const phone = phoneInput ? String(phoneInput.value || '').trim() : '';
          ensureUserId();
          if (phone) setUserProfile({ phone });
          // Р‘Р°Р·РѕРІРѕРµ РёРјСЏ
          const cur = getUserProfile();
          if (!cur.name) setUserProfile({ name: t('profile_default_name', 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ') });
        } catch (e) {}
        localStorage.setItem('isAuth', '1');
        applyState();
        if (window.closeModalById) window.closeModalById('authModal');
      });
    }

    const logoutItem = document.querySelector('.profile-menu [data-i18n="profile_logout"]');
    if (logoutItem) {
      logoutItem.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isAuth');
        applyState();
      });
    }
  })();

  // ===== РЈР›РЈР§РЁР•РќРР•: РЎРІР°Р№Рї РґР»СЏ РїРµСЂРµРєР»СЋС‡РµРЅРёСЏ РІРєР»Р°РґРѕРє РїСЂРѕС„РёР»СЏ =====
  (function initTabSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      const tabsContainer = e.target.closest('[data-profile-tabs]');
      if (!tabsContainer) return;
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
      const tabsContainer = e.target.closest('[data-profile-tabs]');
      if (!tabsContainer) return;
      
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const minSwipe = 50;

      if (Math.abs(diff) < minSwipe) return;

      const modal = tabsContainer.closest('.modal-overlay-auth');
      if (!modal) return;

      const tabs = Array.from(modal.querySelectorAll('[data-profile-tab]'));
      const activeTab = modal.querySelector('[data-profile-tab].active');
      if (!activeTab) return;

      const currentIndex = tabs.indexOf(activeTab);
      let nextTab;

      if (diff > 0) {
        // РЎРІР°Р№Рї РІР»РµРІРѕ - СЃР»РµРґСѓСЋС‰Р°СЏ РІРєР»Р°РґРєР°
        nextTab = tabs[currentIndex + 1];
      } else {
        // РЎРІР°Р№Рї РІРїСЂР°РІРѕ - РїСЂРµРґС‹РґСѓС‰Р°СЏ РІРєР»Р°РґРєР°
        nextTab = tabs[currentIndex - 1];
      }

      if (nextTab) {
        nextTab.click();
      }
    }, false);
  })();

  // ===== РЈР›РЈР§РЁР•РќРР•: РђРІС‚Рѕ-СЃРѕС…СЂР°РЅРµРЅРёРµ Р±РёРѕРіСЂР°С„РёРё РїСЂРё РІС‹С…РѕРґРµ РёР· РїРѕР»СЏ =====
  document.addEventListener('blur', (e) => {
    if (e.target.matches('[data-profile-bio-input]')) {
      const saveBtn = e.target.closest('div')?.querySelector('[data-profile-save-bio]');
      if (saveBtn && e.target.value.trim()) {
        setTimeout(() => saveBtn.click(), 300);
      }
    }
  }, true);
});




