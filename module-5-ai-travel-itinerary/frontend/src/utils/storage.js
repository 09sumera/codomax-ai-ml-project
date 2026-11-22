/**
 * Local storage manager for analysis history, isolated per user.
 */

function getActiveUserId(overrideUserId) {
  if (overrideUserId) return overrideUserId;
  try {
    const rawUser = localStorage.getItem('routeshield_auth_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user?.user_id) return user.user_id;
    }
  } catch (_) {}
  return 'guest';
}

function getStorageKey(userId) {
  const uid = getActiveUserId(userId);
  return `routeshield_analysis_history_${uid}`;
}

export const getAnalysisHistory = (userId = null) => {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Fallback check legacy key once if user is guest
      if (getActiveUserId(userId) === 'guest') {
        const legacy = localStorage.getItem('routeshield_analysis_history');
        if (legacy) return JSON.parse(legacy);
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read analysis history:', e);
    return [];
  }
};

export const saveAnalysisToHistory = (analysisItem, userId = null) => {
  try {
    const key = getStorageKey(userId);
    const history = getAnalysisHistory(userId);
    const activeUid = getActiveUserId(userId);
    const newItem = {
      id: `rs-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: activeUid,
      ...analysisItem,
    };
    const updated = [newItem, ...history.filter(h => h.id !== newItem.id)].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error('Failed to save analysis to history:', e);
    return null;
  }
};

export const clearAnalysisHistory = (userId = null) => {
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
