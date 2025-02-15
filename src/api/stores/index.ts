import { getDB } from "../../utils/dbUtils";
import { Store } from "./types/store.type";
import { PaginationParams, PaginatedResponse } from "./types/pagination.type";

const STORE_NAME = "stores";

export const getAllStores = async (
  pagination?: PaginationParams
): Promise<PaginatedResponse<Store>> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const allStores = request.result;
      if (!pagination) {
        return resolve({
          data: allStores,
          total: allStores.length,
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        });
      }

      const { page, limit } = pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStores = allStores.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allStores.length / limit);

      resolve({
        data: paginatedStores,
        total: allStores.length,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      });
    };
    request.onerror = () => reject(request.error);
  });
};

export const getStoreById = async (id: number): Promise<Store | undefined> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createStore = async (store: Omit<Store, "id">): Promise<Store> => {
  const db = await getDB();
  const stores = await getAllStores();
  const newStore = {
    ...store,
    id: Math.max(...stores.data.map((s) => s.id)) + 1,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(newStore);

    request.onsuccess = () => resolve(newStore);
    request.onerror = () => reject(request.error);
  });
};

export const updateStore = async (
  id: number,
  updateData: Partial<Store>
): Promise<Store | null> => {
  const db = await getDB();
  const existingStore = await getStoreById(id);

  if (!existingStore) return null;

  const updatedStore = { ...existingStore, ...updateData };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(updatedStore);

    request.onsuccess = () => resolve(updatedStore);
    request.onerror = () => reject(request.error);
  });
};

export const deleteStore = async (id: number): Promise<boolean> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};
