// Р Р°СЃС€РёСЂРµРЅРЅРѕРµ РјРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ РїСЂРѕС„РёР»СЏ СЃ РІРєР»Р°РґРєР°РјРё Рё С„СѓРЅРєС†РёСЏРјРё
document.addEventListener('DOMContentLoaded', () => {

  function t(key, fallback) {
    try {
      if (typeof window.getTranslation === 'function') {
        return window.getTranslation(key) || (fallback || key);
      }
    } catch (e) {}
    return fallback || key;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(timestamp) {
    try {
      const date = new Date(Number(timestamp));
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return t('activity_yesterday', 'Р’С‡РµСЂР°');
      } else {
        return date.toLocaleDateString('ru-RU');
      }
    } catch (e) {
      return '';
    }
  }

  // ===== РџР•Р Р•РљР›Р®Р§Р•РќРР• Р’РљР›РђР”РћРљ =====
  
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-profile-tab]');
    if (!tabBtn) return;

    const tabName = tabBtn.getAttribute('data-profile-tab');
    const modal = tabBtn.closest('.modal-overlay-auth');
    if (!modal) return;

    // РЎРєСЂС‹РІР°РµРј РІСЃРµ РІРєР»Р°РґРєРё
    const allTabs = modal.querySelectorAll('[data-profile-tab-content]');
    const allBtns = modal.querySelectorAll('[data-profile-tab]');
    
    allTabs.forEach(tab => tab.style.display = 'none');
    allBtns.forEach(btn => btn.classList.remove('active'));

    // РџРѕРєР°Р·С‹РІР°РµРј РІС‹Р±СЂР°РЅРЅСѓСЋ РІРєР»Р°РґРєСѓ
    tabBtn.classList.add('active');
    const targetTab = modal.querySelector(`[data-profile-tab-content="${tabName}"]`);
    if (targetTab) {
      targetTab.style.display = 'block';
      
      // Р’С‹Р·С‹РІР°РµРј СЂРµРЅРґРµСЂ С„СѓРЅРєС†РёРё РїСЂРё РїРµСЂРµРєР»СЋС‡РµРЅРёРё РЅР° РІРєР»Р°РґРєСѓ
      if (tabName === 'stats' && window.renderProfileStats) {
        window.renderProfileStats();
      } else if (tabName === 'verification' && window.renderProfileVerification) {
        window.renderProfileVerification();
      } else if (tabName === 'activity' && window.renderProfileActivity) {
        window.renderProfileActivity();
      }
    }
  });

  // ===== Р—РђР“Р РЈР—РљРђ РђР’РђРўРђР Рђ =====
  
  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-profile-avatar-input]')) return;

    const file = e.target.files[0];
    if (!file) return;

    if (window.profileManager && window.profileManager.uploadProfileAvatar) {
      window.profileManager.uploadProfileAvatar(file).then(success => {
        if (success) {
          const preview = document.querySelector('[data-profile-avatar-preview]');
          if (preview) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              preview.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
          const hint = document.querySelector('[data-avatar-uploaded-hint]');
          if (hint) {
            hint.style.display = 'block';
            setTimeout(() => { hint.style.display = 'none'; }, 2000);
          }
          try {
            document.dispatchEvent(new CustomEvent('profile:avatar_changed', {
              detail: { userId: window.ensureUserId ? window.ensureUserId() : null }
            }));
          } catch (err) {}
        }
      });
    }
  });

  // ===== РџР•Р Р•РљР›Р®Р§РђРўР•Р›Р РџР Р•Р”РџРћР§РўР•РќРР™ =====
  
  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-profile-toggle]')) return;

    const key = e.target.getAttribute('data-profile-toggle');
    const isChecked = e.target.checked;

    if (window.profileManager && window.profileManager.setProfilePreferences) {
      const userId = window.ensureUserId ? window.ensureUserId() : null;
      window.profileManager.setProfilePreferences(userId, { [key]: isChecked });
    }
  });

  // ===== РЎРћРҐР РђРќР•РќРР• Р‘РРћР“Р РђР¤РР =====
  
  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-profile-save-bio]');
    if (!saveBtn) return;

    const bioInput = document.querySelector('[data-profile-bio-input]');
    if (!bioInput) return;

    const bio = bioInput.value.trim();
    
    if (window.profileManager && window.profileManager.setProfileData) {
      window.profileManager.setProfileData({ bio });
      
      const hint = saveBtn.closest('div')?.querySelector('[data-profile-saved-hint]');
      if (hint) {
        hint.style.display = 'block';
        setTimeout(() => { hint.style.display = 'none'; }, 1500);
      }

      try {
        document.dispatchEvent(new CustomEvent('profile:updated', {
          detail: { 
            userId: window.ensureUserId ? window.ensureUserId() : null,
            changes: { bio }
          }
        }));
      } catch (err) {}
    }
  });

  // ===== Р¤РЈРќРљР¦РР Р Р•РќР”Р•Р Рђ Р’РљР›РђР”РћРљ =====
  
  window.renderProfileStats = function() {
    const container = document.querySelector('[data-profile-tab-content="stats"]');
    if (!container) return;

    const userId = window.ensureUserId ? window.ensureUserId() : null;
    
    if (!window.profileManager) {
      container.innerHTML = '<p style="text-align:center; color:#999;">РЎС‚Р°С‚РёСЃС‚РёРєР° Р·Р°РіСЂСѓР¶Р°РµС‚СЃСЏ...</p>';
      return;
    }

    const stats = window.profileManager.getProfileStats(userId);
    const level = window.profileManager.getProfileLevel(userId);
    const rating = window.profileManager.getProfileRating(userId);
    const achievements = window.profileManager.checkAchievements(userId);

    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += `<span style="font-size:18px; color:#f5c400;">${i < Math.floor(rating.rating) ? 'в…' : 'в†'}</span>`;
    }

    const achievementsList = [
      { id: 'first_ad', icon: 'рџЋ‰', name: t('profile_achievement_first_ad', 'РџРµСЂРІРѕРµ РѕР±СЉСЏРІР»РµРЅРёРµ') },
      { id: 'five_ads', icon: 'рџ“ќ', name: t('profile_achievement_five_ads', '5 РѕР±СЉСЏРІР»РµРЅРёР№') },
      { id: 'ten_ads', icon: 'рџ“љ', name: t('profile_achievement_ten_ads', '10 РѕР±СЉСЏРІР»РµРЅРёР№') },
      { id: 'hundred_views', icon: 'рџ‘Ђ', name: t('profile_achievement_hundred_views', '100 РїСЂРѕСЃРјРѕС‚СЂРѕРІ') },
      { id: 'thousand_views', icon: 'рџ”Ґ', name: t('profile_achievement_thousand_views', '1000 РїСЂРѕСЃРјРѕС‚СЂРѕРІ') },
      { id: 'ten_favorites', icon: 'вќ¤пёЏ', name: t('profile_achievement_ten_favorites', '10 РІ РёР·Р±СЂР°РЅРЅРѕРј') },
      { id: 'fifty_favorites', icon: 'рџ’Ћ', name: t('profile_achievement_fifty_favorites', '50 РІ РёР·Р±СЂР°РЅРЅРѕРј') }
    ];

    let achievementsHtml = '';
    achievementsList.forEach(ach => {
      const unlocked = achievements.includes(ach.id);
      achievementsHtml += `
        <div class="profile-achievement ${unlocked ? 'unlocked' : 'locked'}" title="${unlocked ? 'Р Р°Р·Р±Р»РѕРєРёСЂРѕРІР°РЅРѕ: ' + ach.name : 'Р Р°Р·Р±Р»РѕРєРёСЂСѓР№С‚Рµ: ' + ach.name}" style="cursor: help; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <span class="profile-achievement-icon">${ach.icon}</span>
          <div class="profile-achievement-name">${ach.name}</div>
          <div class="profile-achievement-status">${unlocked ? 'вњ“' : 'рџ”’'}</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="profile-stat-box">
            <div class="profile-stat-value">${stats.totalAds}</div>
            <div class="profile-stat-label">${t('profile_my_ads', 'РћР±СЉСЏРІР»РµРЅРёСЏ')}</div>
          </div>
          <div class="profile-stat-box">
            <div class="profile-stat-value">${stats.activeAds}</div>
            <div class="profile-stat-label">${t('profile_published', 'РђРєС‚РёРІРЅС‹Рµ')}</div>
          </div>
          <div class="profile-stat-box">
            <div class="profile-stat-value">${stats.views}</div>
            <div class="profile-stat-label">${t('profile_views', 'РџСЂРѕСЃРјРѕС‚СЂС‹')}</div>
          </div>
          <div class="profile-stat-box">
            <div class="profile-stat-value">${stats.favorites}</div>
            <div class="profile-stat-label">${t('profile_favorites', 'РР·Р±СЂР°РЅРЅРѕРµ')}</div>
          </div>
        </div>

        <div class="profile-level-box" style="background: linear-gradient(135deg, ${level.color}99 0%, ${level.color} 100%); border-left: 4px solid ${level.color};">
          <span style="font-size: 24px;">${['', 'рџҐ‰', 'рџҐ€', 'рџҐ‡', 'рџ‘‘', 'рџ’Ћ'][level.level]}</span>
          <div>
            <div style="font-size: 12px; opacity: 0.8;">${t('profile_level', 'РЈСЂРѕРІРµРЅСЊ')}</div>
            <div style="font-weight: 700; font-size: 16px;">${level.title}</div>
          </div>
        </div>

        <div style="background: #f5f5f5; padding: 12px; border-radius: 8px;">
          <div style="font-weight: 600; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 3px solid #e0b000; font-size: 15px;">${t('profile_rating', 'Р РµР№С‚РёРЅРі')}</div>
          <div style="display: flex; gap: 6px; margin-bottom: 8px;">${starsHtml}</div>
          <div style="font-size: 14px; color: #666;">${rating.rating.toFixed(1)} ${t('profile_rating', 'СЂРµР№С‚РёРЅРі')} (${rating.count} ${t('profile_reviews', 'РѕС‚Р·С‹РІРѕРІ')})</div>
        </div>

        <div style="border-top: 1px solid #e0e0e0; padding-top: 16px;">
          <div style="font-weight: 700; margin-bottom: 12px; font-size: 15px; padding-bottom: 12px; border-bottom: 3px solid #e0b000;">${t('profile_achievements', 'Р”РѕСЃС‚РёР¶РµРЅРёСЏ')}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">${achievementsHtml}</div>
        </div>

      </div>
    `;
  };

  window.renderProfileVerification = function() {
    const container = document.querySelector('[data-profile-tab-content="verification"]');
    if (!container) return;

    const userId = window.ensureUserId ? window.ensureUserId() : null;
    
    if (!window.profileManager) {
      container.innerHTML = '<p style="text-align:center; color:#999;">Р’РµСЂРёС„РёРєР°С†РёСЏ Р·Р°РіСЂСѓР¶Р°РµС‚СЃСЏ...</p>';
      return;
    }

    const status = window.profileManager.getVerificationStatus(userId);

    if (status.verified) {
      const methodText = status.method === 'phone' ? t('profile_verify_by_phone', 'РџРѕ С‚РµР»РµС„РѕРЅСѓ') : t('profile_verify_by_id', 'РџРѕ ID');
      const verifiedDate = new Date(status.verifiedAt).toLocaleDateString('ru-RU');
      
      container.innerHTML = `
        <div style="text-align: center; padding: 24px 0;">
          <div style="font-size: 48px; margin-bottom: 16px;">вњ…</div>
          <div style="font-weight: 700; font-size: 16px; margin-bottom: 8px;">${t('profile_verified', 'Р’С‹ РІРµСЂРёС„РёС†РёСЂРѕРІР°РЅС‹')}</div>
          <div style="color: #666; font-size: 14px; margin-bottom: 16px;">
            ${t('profile_verified_by', 'Р’РµСЂРёС„РёС†РёСЂРѕРІР°РЅРѕ')} ${methodText}<br/>
            ${verifiedDate}
          </div>
          <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 12px; border-radius: 4px; font-size: 13px; color: #1b5e20;">
            ${t('profile_verified_help', 'Р’РµСЂРёС„РёС†РёСЂРѕРІР°РЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»Рё Р·Р°СЃР»СѓР¶РёРІР°СЋС‚ Р±РѕР»СЊС€РµРіРѕ РґРѕРІРµСЂРёСЏ РґСЂСѓРіРёС… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№.')}
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="color: #666; font-size: 14px; text-align: center;">
            ${t('profile_verification_help', 'Р’РµСЂРёС„РёРєР°С†РёСЏ РїРѕРјРѕРіР°РµС‚ РґСЂСѓРіРёРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРј РґРѕРІРµСЂСЏС‚СЊ РІР°Рј. Р’С‹Р±РµСЂРёС‚Рµ СЃРїРѕСЃРѕР± РІРµСЂРёС„РёРєР°С†РёРё:')}
          </p>
          
          <button class="profile-verify-btn" data-verify-phone>
            <span style="font-size: 20px;">рџ“±</span>
            <span>${t('profile_verify_by_phone', 'Р’РµСЂРёС„РёС†РёСЂРѕРІР°С‚СЊ РїРѕ С‚РµР»РµС„РѕРЅСѓ')}</span>
          </button>
          
          <button class="profile-verify-btn" data-verify-id>
            <span style="font-size: 20px;">рџ†”</span>
            <span>${t('profile_verify_by_id', 'Р’РµСЂРёС„РёС†РёСЂРѕРІР°С‚СЊ РїРѕ ID')}</span>
          </button>
        </div>
      `;

      const phoneBtn = container.querySelector('[data-verify-phone]');
      const idBtn = container.querySelector('[data-verify-id]');

      if (phoneBtn) {
        phoneBtn.addEventListener('click', () => {
          if (window.profileManager && window.profileManager.setVerificationStatus) {
            window.profileManager.setVerificationStatus(userId, 'phone');
            localStorage.setItem('isVerified', '1');
            window.renderProfileVerification();
          }
        });
      }

      if (idBtn) {
        idBtn.addEventListener('click', () => {
          if (window.profileManager && window.profileManager.setVerificationStatus) {
            window.profileManager.setVerificationStatus(userId, 'id');
            localStorage.setItem('isVerified', '1');
            window.renderProfileVerification();
          }
        });
      }
    }
  };

  window.renderProfileActivity = function() {
    const container = document.querySelector('[data-profile-tab-content="activity"]');
    if (!container) return;

    const userId = window.ensureUserId ? window.ensureUserId() : null;
    
    if (!window.profileManager) {
      container.innerHTML = '<p style="text-align:center; color:#999;">РђРєС‚РёРІРЅРѕСЃС‚СЊ Р·Р°РіСЂСѓР¶Р°РµС‚СЃСЏ...</p>';
      return;
    }

    const activities = window.profileManager.getProfileActivity(userId);

    if (activities.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: #999; padding: 24px 0;">${t('profile_no_activity', 'РђРєС‚РёРІРЅРѕСЃС‚СЊ РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚')}</p>`;
      return;
    }

    const actionTexts = {
      'profile_updated': t('activity_profile_updated', 'РџСЂРѕС„РёР»СЊ РѕР±РЅРѕРІР»С‘РЅ'),
      'avatar_changed': t('activity_avatar_changed', 'РђРІР°С‚Р°СЂ РёР·РјРµРЅС‘РЅ'),
      'ad_published': t('activity_ad_published', 'РћР±СЉСЏРІР»РµРЅРёРµ РѕРїСѓР±Р»РёРєРѕРІР°РЅРѕ'),
      'ad_hidden': t('activity_ad_hidden', 'РћР±СЉСЏРІР»РµРЅРёРµ СЃРЅСЏС‚Рѕ'),
      'verified': t('activity_verified', 'Р’РµСЂРёС„РёС†РёСЂРѕРІР°РЅ'),
      'review_added': t('activity_review_added', 'РџРѕР»СѓС‡РµРЅ РѕС‚Р·С‹РІ')
    };

    const icons = {
      'profile_updated': 'вњЏпёЏ',
      'avatar_changed': 'рџ“ё',
      'ad_published': 'рџ“ќ',
      'ad_hidden': 'рџ—‘пёЏ',
      'verified': 'вњ…',
      'review_added': 'в­ђ'
    };

    let activitiesHtml = '';
    activities.slice(0, 15).forEach((act, idx) => {
      const icon = icons[act.action] || 'рџ“Њ';
      const text = actionTexts[act.action] || act.action;
      const dateStr = formatDate(act.timestamp);
      
      activitiesHtml += `
        <div style="display: flex; gap: 12px; padding: 12px 0; ${idx !== 0 ? 'border-top: 1px solid #eee;' : ''}">
          <div style="font-size: 18px; flex: 0 0 auto;">${icon}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; margin-bottom: 2px;">${text}</div>
            <div style="font-size: 12px; color: #999;">${dateStr}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `<div>${activitiesHtml}</div>`;
  };

  // ===== РРќРР¦РРђР›РР—РђР¦РРЇ РџР РћР¤РР›РЇ РџР Р РћРўРљР Р«РўРР РњРћР”РђР›Р =====
  
  const originalOnModalOpened = window.onModalOpened;
  window.onModalOpened = function(modalId) {
    if (originalOnModalOpened) {
      originalOnModalOpened.call(this, modalId);
    }
    
    if (modalId === 'profileModal') {
      initProfileModal();
    }
  };

  function initProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    // РђРєС‚РёРІРёСЂСѓРµРј РїРµСЂРІСѓСЋ РІРєР»Р°РґРєСѓ
    const firstTab = modal.querySelector('[data-profile-tab]');
    const firstContent = modal.querySelector('[data-profile-tab-content]');
    
    if (firstTab && !firstTab.classList.contains('active')) {
      firstTab.click();
    } else if (firstContent && firstContent.style.display !== 'block') {
      firstContent.style.display = 'block';
      if (firstTab) firstTab.classList.add('active');
    }
  }

});

