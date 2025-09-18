export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export interface CacheData<T> {
  data: T;
  lastFetched: number;
}

export const getCache = <T>(cacheKey: string): CacheData<T> | null => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

export const setCache = <T>(cacheKey: string, data: T): void => {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      lastFetched: Date.now()
    }));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export const clearCache = (cacheKey: string): void => {
  try {
    sessionStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export const isCacheValid = (cache: CacheData<any> | null): boolean => {
  if (!cache || !cache.lastFetched) return false;
  const now = Date.now();
  return (now - cache.lastFetched < CACHE_DURATION);
};

// Clear all caches for a specific user to prevent data mixing
export const clearUserCaches = (userEmail: string): void => {
  try {
    sessionStorage.removeItem(`wedding_details_cache_${userEmail}`);
    sessionStorage.removeItem(`settings_cache_${userEmail}`);
    console.log(`Cleared all caches for user: ${userEmail}`);
  } catch (error) {
    console.error('Error clearing user caches:', error);
  }
};

// Clear all caches (useful for debugging or complete reset)
export const clearAllCaches = (): void => {
  try {
    // Get all keys that look like our cache keys
    const keys = Object.keys(sessionStorage);
    const cacheKeys = keys.filter(key => 
      key.includes('wedding_details_cache_') || 
      key.includes('settings_cache_')
    );
    
    cacheKeys.forEach(key => sessionStorage.removeItem(key));
    console.log(`Cleared ${cacheKeys.length} cache entries`);
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
}; 