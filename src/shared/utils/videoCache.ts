const CACHE_NAME = "tasbeeh-video-cache-v1";

/**
 * Ensures the video is fully downloaded as a Blob into CacheStorage.
 * Returns a local ObjectURL that bypasses iOS Safari's partial-content (206) streaming bugs
 * and guarantees 0 buffering once the URL is returned.
 */
export async function getOrFetchVideo(url: string): Promise<string> {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Check if we already downloaded this video completely
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      return URL.createObjectURL(blob);
    }

    // Not in cache, fetch it completely over network
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network response was not ok for ${url}`);
    
    // We clone it because body can only be read once (one for cache, one for blob)
    await cache.put(url, response.clone());
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error(`Failed to load and cache video ${url}:`, error);
    // Fallback: If cache fails (e.g. storage limits) just return the raw URL
    // so it attempts standard network streaming.
    return url;
  }
}

/**
 * Fire-and-forget preloader to be called during Splash screen
 */
export function preloadVideos(urls: string[]) {
  if (typeof window !== "undefined" && "caches" in window) {
    urls.forEach(url => {
      // Background async fetch + cache mapping, we don't await this
      getOrFetchVideo(url).catch(console.error);
    });
  }
}
