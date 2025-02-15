import storesData from "../api/stores/data/stores.json";
import booksData from "../api/books/data/books.json";
import authorData from "../api/authors/data/authors.json";

const DB_NAME = "edroBookStore";
const STORE_NAME = "stores";
const BOOK_NAME = "books";
const AUTHOR_NAME = "authors";
const DB_VERSION = 1;

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
      const db = request.result;

      // Check if data needs to be initialized
      const tx = db.transaction(
        [STORE_NAME, BOOK_NAME, AUTHOR_NAME],
        "readonly"
      );
      const store = tx.objectStore(STORE_NAME);
      const bookStore = tx.objectStore(BOOK_NAME);
      const authorStore = tx.objectStore(AUTHOR_NAME);

      const storeCountRequest = store.count();
      const bookCountRequest = bookStore.count();
      const authorCountRequest = authorStore.count();

      storeCountRequest.onsuccess = () => {
        if (storeCountRequest.result === 0) {
          // Initialize stores data
          const writeTx = db.transaction(STORE_NAME, "readwrite");
          const writeStore = writeTx.objectStore(STORE_NAME);
          storesData.forEach((store) => {
            writeStore.add(store);
          });
          writeTx.oncomplete = () => resolve();
          writeTx.onerror = () => reject(writeTx.error);
        }
      };

      bookCountRequest.onsuccess = () => {
        if (bookCountRequest.result === 0) {
          // Initialize books data
          const writeTx = db.transaction(BOOK_NAME, "readwrite");
          const writeBookStore = writeTx.objectStore(BOOK_NAME);
          booksData.forEach((book) => {
            writeBookStore.add(book);
          });
          writeTx.oncomplete = () => resolve();
          writeTx.onerror = () => reject(writeTx.error);
        }
      };

      authorCountRequest.onsuccess = () => {
        if (authorCountRequest.result === 0) {
          // Initialize authors data
          const writeTx = db.transaction(AUTHOR_NAME, "readwrite");
          const writeAuthorStore = writeTx.objectStore(AUTHOR_NAME);
          authorData.forEach((author) => {
            writeAuthorStore.add(author);
          });
          writeTx.oncomplete = () => resolve();
          writeTx.onerror = () => reject(writeTx.error);
        }
      };
    };
  });
};

export const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
