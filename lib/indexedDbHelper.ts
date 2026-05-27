export interface WalkCoordinate {
  id?: number;
  eventId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
}

const DB_NAME = 'MelaMargLocalDB';
const DB_VERSION = 1;
const STORE_NAME = 'walk_coordinates';

/**
 * Initializes the IndexedDB database and sets up object stores/indexes.
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is not available in server-side rendering (SSR) environments.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        // Index by eventId to quickly query walking trails per festival
        store.createIndex('eventId', 'eventId', { unique: false });
        console.log(`[IndexedDB] Created object store: ${STORE_NAME}`);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error('[IndexedDB] Database open error:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Adds a new walking coordinate to local IndexedDB.
 */
export async function addCoordinate(
  eventId: string,
  latitude: number,
  longitude: number,
  accuracy: number
): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const record: WalkCoordinate = {
      eventId,
      timestamp: Date.now(),
      latitude,
      longitude,
      accuracy,
    };

    const request = store.add(record);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to add coordinate:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Retrieves all walking coordinates for a specific eventId, ordered chronologically.
 */
export async function getCoordinates(eventId: string): Promise<WalkCoordinate[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('eventId');
    const request = index.getAll(IDBKeyRange.only(eventId));

    request.onsuccess = () => {
      const records = request.result as WalkCoordinate[];
      // Sort chronologically just in case IndexedDB index indexing yields non-chronological order
      records.sort((a, b) => a.timestamp - b.timestamp);
      resolve(records);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to retrieve coordinates:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Clears all logged coordinates for a specific eventId.
 */
export async function clearCoordinates(eventId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('eventId');
    
    // Open cursor to delete matched eventId entries
    const request = index.openCursor(IDBKeyRange.only(eventId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to clear event coordinates:', request.error);
      reject(request.error);
    };
  });
}
