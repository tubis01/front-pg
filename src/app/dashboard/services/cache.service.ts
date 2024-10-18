// cache.service.ts
import { Injectable } from '@angular/core';

interface CacheItem {
  data: any;
  expiration: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache: Map<string, CacheItem> = new Map();

  set(key: string, data: any, ttl: number = 60000): void { // TTL predeterminado de 1 minuto
    const expiration = Date.now() + ttl;
    this.cache.set(key, { data, expiration });

  }

  get(key: string): any | null {
    const cacheItem = this.cache.get(key);
    if (!cacheItem) {
      return null;
    }
    if (Date.now() > cacheItem.expiration) {
      this.cache.delete(key); // Eliminar si ha expirado
      return null;
    }
    return cacheItem.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
