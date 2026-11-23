// offlineRouteStore.js
// Basic IndexedDB wrapper for offline routes, isolated per user

const DB_NAME = 'RouteShieldOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'savedRoutes';

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

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject('IndexedDB error: ' + event.target.error);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'route_id' });
      }
    };
  });
}

export async function saveRouteOffline(route, userId = null) {
  const db = await openDB();
  const currentUserId = getActiveUserId(userId);
  const routeRecord = {
    ...route,
    user_id: route.user_id || currentUserId,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(routeRecord);

    request.onsuccess = () => resolve(routeRecord);
    request.onerror = (event) => reject('Error saving offline route: ' + event.target.error);
  });
}

export async function getOfflineRoutes(userId = null) {
  const db = await openDB();
  const currentUserId = getActiveUserId(userId);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const allRoutes = request.result || [];
      const userFiltered = allRoutes.filter(
        (r) => r.user_id === currentUserId || (!r.user_id && currentUserId === 'guest')
      );
      resolve(userFiltered);
    };
    request.onerror = (event) => reject('Error fetching offline routes: ' + event.target.error);
  });
}

export async function getOfflineRoute(routeId, userId = null) {
  const db = await openDB();
  const currentUserId = getActiveUserId(userId);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(routeId);

    request.onsuccess = () => {
      const route = request.result;
      if (route && (route.user_id === currentUserId || !route.user_id)) {
        resolve(route);
      } else {
        resolve(null);
      }
    };
    request.onerror = (event) => reject('Error fetching offline route: ' + event.target.error);
  });
}

export async function deleteOfflineRoute(routeId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(routeId);

    request.onsuccess = () => resolve(true);
    request.onerror = (event) => reject('Error deleting offline route: ' + event.target.error);
  });
}

export async function clearOfflineRoutes(userId = null) {
  const db = await openDB();
  const currentUserId = getActiveUserId(userId);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getAllReq = store.getAll();

    getAllReq.onsuccess = () => {
      const allRoutes = getAllReq.result || [];
      const userRouteIds = allRoutes
        .filter((r) => r.user_id === currentUserId || (!r.user_id && currentUserId === 'guest'))
        .map((r) => r.route_id);

      userRouteIds.forEach((id) => store.delete(id));
      resolve(true);
    };
    getAllReq.onerror = (event) => reject('Error clearing offline routes: ' + event.target.error);
  });
}
