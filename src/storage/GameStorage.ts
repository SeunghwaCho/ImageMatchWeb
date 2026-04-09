export interface SavedGameData {
  id: string;
  gameState: any;
  timestamp: number;
  version: string;
}

export class GameStorage {
  private dbName = 'ImageMatchDB';
  private storeName = 'gameState';
  private version = 1;
  private db: IDBDatabase | null = null;

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async save(gameState: any): Promise<void> {
    if (!this.db) await this.open();
    const data: SavedGameData = {
      id: 'current',
      gameState,
      timestamp: Date.now(),
      version: '1.0.0',
    };
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load(): Promise<any | null> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get('current');
      request.onsuccess = () => {
        const data = request.result as SavedGameData | undefined;
        resolve(data ? data.gameState : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete('current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async hasSavedGame(): Promise<boolean> {
    const data = await this.load();
    return data !== null;
  }
}
