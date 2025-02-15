import storesData from "../api/stores/data/stores.json";
import booksData from "../api/books/data/books.json";
import authorData from "../api/authors/data/authors.json";

const DB_NAME = "edroBookStore";
const STORE_NAME = "stores";
const BOOK_NAME = "books";
const AUTHOR_NAME = "authors";
const DB_VERSION = 1;

let isInitialized = false;

const populateData = (db: IDBDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(
        [STORE_NAME, BOOK_NAME, AUTHOR_NAME],
        "readwrite"
      );

      const storesStore = tx.objectStore(STORE_NAME);
      const booksStore = tx.objectStore(BOOK_NAME);
      const authorsStore = tx.objectStore(AUTHOR_NAME);

      storesStore.count().onsuccess = (e) => {
        if ((e.target as IDBRequest).result === 0) {
          storesData.forEach((store) => storesStore.add(store));
        }
      };

      booksStore.count().onsuccess = (e) => {
        if ((e.target as IDBRequest).result === 0) {
          booksData.forEach((book) => booksStore.add(book));
        }
      };

      authorsStore.count().onsuccess = (e) => {
        if ((e.target as IDBRequest).result === 0) {
          authorData.forEach((author) => authorsStore.add(author));
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (error) {
      reject(error);
    }
  });
};

export const initDB = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(BOOK_NAME)) {
        db.createObjectStore(BOOK_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(AUTHOR_NAME)) {
        db.createObjectStore(AUTHOR_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = async () => {
      try {
        await populateData(request.result);
        isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
};

export const getDB = async (): Promise<IDBDatabase> => {
  if (!isInitialized) {
    await initDB();
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
