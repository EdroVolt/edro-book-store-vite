import { getDB } from "../../utils/dbUtils";
import { Author } from "./types/authors.type";
import {
  PaginationParams,
  PaginatedResponse,
} from "../stores/types/pagination.type";

const STORE_NAME = "authors";

export const getAllAuthors = async (
  pagination?: PaginationParams
): Promise<PaginatedResponse<Author>> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const allAuthors = request.result;
      if (!pagination) {
        return resolve({
          data: allAuthors,
          total: allAuthors.length,
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        });
      }

      const { page, limit } = pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAuthors = allAuthors.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allAuthors.length / limit);

      resolve({
        data: paginatedAuthors,
        total: allAuthors.length,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      });
    };
    request.onerror = () => reject(request.error);
  });
};

export const getAuthorById = async (
  id: number
): Promise<Author | undefined> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createAuthor = async (
  author: Omit<Author, "id">
): Promise<Author> => {
  const db = await getDB();
  const authors = await getAllAuthors();
  const newAuthor = {
    ...author,
    id: Math.max(...authors.data.map((a) => a.id), 0) + 1,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(newAuthor);

    request.onsuccess = () => resolve(newAuthor);
    request.onerror = () => reject(request.error);
  });
};

export const updateAuthor = async (
  id: number,
  updateData: Partial<Author>
): Promise<Author | null> => {
  const db = await getDB();
  const existingAuthor = await getAuthorById(id);

  if (!existingAuthor) return null;

  const updatedAuthor = { ...existingAuthor, ...updateData };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(updatedAuthor);

    request.onsuccess = () => resolve(updatedAuthor);
    request.onerror = () => reject(request.error);
  });
};

export const deleteAuthor = async (id: number): Promise<boolean> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};
