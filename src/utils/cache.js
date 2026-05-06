class CacheManager {
  constructor(maxAge = 5 * 60 * 1000) { // 5 menit default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key, data, customMaxAge = null) {
    const maxAge = customMaxAge || this.maxAge;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      maxAge
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.maxAge;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }

  cleanup() {
    for (const [key] of this.cache) {
      this.get(key); // This will automatically delete expired items
    }
  }
}

// Export singleton instances for different caches
export const placesCache = new CacheManager(10 * 60 * 1000); // 10 menit
export const routeCache = new CacheManager(5 * 60 * 1000); // 5 menit
export const searchCache = new CacheManager(2 * 60 * 1000); // 2 menit

export default CacheManager;