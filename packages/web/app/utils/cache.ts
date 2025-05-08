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