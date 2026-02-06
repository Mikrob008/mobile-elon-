// РЈРїСЂР°РІР»РµРЅРёРµ РїСЂРѕС„РёР»РµРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
document.addEventListener('DOMContentLoaded', () => {
  
  // ===== РџР РћР¤РР›Р¬: Р—РђР“Р РЈР—РљРђ Р РЎРћРҐР РђРќР•РќРР• Р”РђРќРќР«РҐ =====
  
  function getProfileData() {
    try {
      const raw = localStorage.getItem('user_profile');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setProfileData(obj) {
    try {
      const current = getProfileData();
      const updated = { ...current, ...obj, updatedAt: Date.now() };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      return updated;
    } catch (e) {
      return {};
    }
  }

  function getProfileById(userId) {
    try {
      const raw = localStorage.getItem(`profile_${userId}`);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setProfileById(userId, obj) {
    try {
      const current = getProfileById(userId);
      const updated = { ...current, ...obj, updatedAt: Date.now() };
      localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return {};
    }
  }

  // ===== РџР РћР¤РР›Р¬: РђР’РђРўРђР  =====
  
  function getProfileAvatar() {
    const profile = getProfileData();
    return profile.avatar || null;
  }

  function setProfileAvatar(dataUrl) {
    if (dataUrl && dataUrl.length > 500000) {
      console.warn('Avatar too large, skipping');
      return false;
    }
    setProfileData({ avatar: dataUrl });
    return true;
  }

  function uploadProfileAvatar(file) {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = setProfileAvatar(e.target.result);
        resolve(success);
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  }

  // ===== РџР РћР¤РР›Р¬: РЎРўРђРўРРЎРўРРљРђ =====
  
  function getProfileStats(userId) {
    try {
      const allAds = (() => {
        try {
          const raw = localStorage.getItem('submitted_ads');
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return [];
        }
      })();

      const userAds = allAds.filter(a => String(a.sellerId || '') === String(userId));
      
      return {
        totalAds: userAds.length,
        activeAds: userAds.filter(a => a.status !== 'hidden').length,
        hiddenAds: userAds.filter(a => a.status === 'hidden').length,
        views: userAds.reduce((sum, a) => sum + (a.views || 0), 0),
        favorites: userAds.reduce((sum, a) => sum + (a.favoriteCount || 0), 0)
      };
    } catch (e) {
      return { totalAds: 0, activeAds: 0, hiddenAds: 0, views: 0, favorites: 0 };
    }
  }

  // ===== РџР РћР¤РР›Р¬: РРЎРўРћР РРЇ Р РђРљРўРР’РќРћРЎРўР¬ =====
  
  function addProfileActivity(userId, action, details = {}) {
    try {
      const activities = (() => {
        try {
          const raw = localStorage.getItem(`profile_activities_${userId}`);
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return [];
        }
      })();

      activities.unshift({
        action,
        timestamp: Date.now(),
        details
      });

      // РЎРѕС…СЂР°РЅСЏРµРј С‚РѕР»СЊРєРѕ РїРѕСЃР»РµРґРЅРёРµ 50 Р°РєС‚РёРІРЅРѕСЃС‚РµР№
      if (activities.length > 50) activities.pop();
      
      localStorage.setItem(`profile_activities_${userId}`, JSON.stringify(activities));
      return activities;
    } catch (e) {
      return [];
    }
  }

  function getProfileActivity(userId) {
    try {
      const raw = localStorage.getItem(`profile_activities_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // ===== РџР РћР¤РР›Р¬: РЈР РћР’РќР Р Р”РћРЎРўРР–Р•РќРРЇ =====
  
  function getProfileLevel(userId) {
    const stats = getProfileStats(userId);
    const totalAds = stats.totalAds;
    
    if (totalAds < 3) return { level: 1, title: 'РќРѕРІРёС‡РѕРє', color: '#9e9e9e' };
    if (totalAds < 10) return { level: 2, title: 'РђРєС‚РёРІРЅС‹Р№', color: '#e0b000' };
    if (totalAds < 25) return { level: 3, title: 'РћРїС‹С‚РЅС‹Р№', color: '#f2b700' };
    if (totalAds < 50) return { level: 4, title: 'Р­РєСЃРїРµСЂС‚', color: '#d99a00' };
    return { level: 5, title: 'РњР°СЃС‚РµСЂ', color: '#4caf50' };
  }

  function checkAchievements(userId) {
    const stats = getProfileStats(userId);
    const achievements = [];

    if (stats.totalAds >= 1) achievements.push('first_ad');
    if (stats.totalAds >= 5) achievements.push('five_ads');
    if (stats.totalAds >= 10) achievements.push('ten_ads');
    if (stats.views >= 100) achievements.push('hundred_views');
    if (stats.views >= 1000) achievements.push('thousand_views');
    if (stats.favorites >= 10) achievements.push('ten_favorites');
    if (stats.favorites >= 50) achievements.push('fifty_favorites');

    return achievements;
  }

  // ===== РџР РћР¤РР›Р¬: Р”РћРЎРўРћР’Р•Р РќРћРЎРўР¬ =====
  
  function getVerificationStatus(userId) {
    try {
      const raw = localStorage.getItem(`verification_${userId}`);
      if (!raw) return { verified: false, method: null, verifiedAt: null };
      return JSON.parse(raw);
    } catch (e) {
      return { verified: false, method: null, verifiedAt: null };
    }
  }

  function setVerificationStatus(userId, method) {
    try {
      const status = { verified: true, method, verifiedAt: Date.now() };
      localStorage.setItem(`verification_${userId}`, JSON.stringify(status));
      addProfileActivity(userId, 'verified', { method });
      return status;
    } catch (e) {
      return null;
    }
  }

  // ===== РџР РћР¤РР›Р¬: Р Р•Р™РўРРќР“ =====
  
  function getProfileRating(userId) {
    try {
      const raw = localStorage.getItem(`profile_rating_${userId}`);
      if (!raw) return { rating: 5, count: 0, reviews: [] };
      return JSON.parse(raw);
    } catch (e) {
      return { rating: 5, count: 0, reviews: [] };
    }
  }

  function addReviewToProfile(userId, review) {
    try {
      const current = getProfileRating(userId);
      current.reviews = current.reviews || [];
      current.reviews.unshift({
        ...review,
        createdAt: Date.now()
      });

      // РџРµСЂРµСЃС‡РёС‚Р°РµРј СЃСЂРµРґРЅСЋСЋ РѕС†РµРЅРєСѓ
      if (current.reviews.length > 0) {
        const sum = current.reviews.reduce((s, r) => s + (r.rating || 5), 0);
        current.rating = Math.round((sum / current.reviews.length) * 100) / 100;
        current.count = current.reviews.length;
      }

      // РЎРѕС…СЂР°РЅСЏРµРј С‚РѕР»СЊРєРѕ РїРѕСЃР»РµРґРЅРёРµ 20 РѕС‚Р·С‹РІРѕРІ
      if (current.reviews.length > 20) current.reviews = current.reviews.slice(0, 20);

      localStorage.setItem(`profile_rating_${userId}`, JSON.stringify(current));
      return current;
    } catch (e) {
      return null;
    }
  }

  // ===== РџР РћР¤РР›Р¬: РџР Р•Р”РџРћР§РўР•РќРРЇ Р РќРђРЎРўР РћР™РљР =====
  
  function getProfilePreferences(userId) {
    try {
      const raw = localStorage.getItem(`profile_preferences_${userId}`);
      return raw ? JSON.parse(raw) : {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        privateProfile: false,
        showPhone: true,
        showEmail: true
      };
    } catch (e) {
      return {};
    }
  }

  function setProfilePreferences(userId, prefs) {
    try {
      const current = getProfilePreferences(userId);
      const updated = { ...current, ...prefs };
      localStorage.setItem(`profile_preferences_${userId}`, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return {};
    }
  }

  // ===== Р­РљРЎРџРћР Рў Р“Р›РћР‘РђР›Р¬РќР«РҐ Р¤РЈРќРљР¦РР™ =====
  
  window.profileManager = {
    getProfileData,
    setProfileData,
    getProfileById,
    setProfileById,
    getProfileAvatar,
    setProfileAvatar,
    uploadProfileAvatar,
    getProfileStats,
    addProfileActivity,
    getProfileActivity,
    getProfileLevel,
    checkAchievements,
    getVerificationStatus,
    setVerificationStatus,
    getProfileRating,
    addReviewToProfile,
    getProfilePreferences,
    setProfilePreferences
  };

  // ===== РЎРћР‘Р«РўРРЇ РџР РћР¤РР›РЇ =====
  
  document.addEventListener('profile:updated', (e) => {
    try {
      const { userId, changes } = e.detail;
      if (userId && changes) {
        setProfileById(userId, changes);
        addProfileActivity(userId, 'profile_updated', changes);
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
  });

  document.addEventListener('profile:avatar_changed', (e) => {
    try {
      const { userId } = e.detail;
      if (userId) {
        addProfileActivity(userId, 'avatar_changed');
      }
    } catch (err) {
      console.error('Profile avatar change error:', err);
    }
  });

  // ===== РЈР›РЈР§РЁР•РќРР•: РљРµС€ РґР»СЏ Р±С‹СЃС‚СЂРѕРіРѕ РґРѕСЃС‚СѓРїР° Рє РґР°РЅРЅС‹Рј РїСЂРѕС„РёР»СЏ =====
  const profileCache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 РјРёРЅСѓС‚

  window.getProfileDataCached = function(userId) {
    const cacheKey = `profile_${userId}`;
    const cached = profileCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    const data = getProfileById(userId);
    profileCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  };

  window.clearProfileCache = function(userId) {
    if (userId) {
      profileCache.delete(`profile_${userId}`);
    } else {
      profileCache.clear();
    }
  };

  // РћС‡РёС‰Р°РµРј РєРµС€ РїСЂРё РѕР±РЅРѕРІР»РµРЅРёРё РїСЂРѕС„РёР»СЏ
  document.addEventListener('profile:updated', (e) => {
    if (e.detail?.userId) {
      window.clearProfileCache(e.detail.userId);
    }
  });

});

