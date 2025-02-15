import { getDB } from "../../utils/dbUtils";
import { Book } from "./types/books.type";
import {
  PaginationParams,
  PaginatedResponse,
} from "../stores/types/pagination.type";

const STORE_NAME = "books";

export const getAllBooks = async (
  pagination?: PaginationParams
): Promise<PaginatedResponse<Book>> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const allBooks = request.result;
      if (!pagination) {
        return resolve({
          data: allBooks,
          total: allBooks.length,
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        });
      }

      const { page, limit } = pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = allBooks.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allBooks.length / limit);

      resolve({
        data: paginatedBooks,
        total: allBooks.length,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      });
    };
    request.onerror = () => reject(request.error);
  });
};

export const getBookById = async (id: number): Promise<Book | undefined> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const db = await getDB();
  const books = await getAllBooks();
  const newBook = {
    ...book,
    id: Math.max(...books.data.map((b) => b.id), 0) + 1,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(newBook);

    request.onsuccess = () => resolve(newBook);
    request.onerror = () => reject(request.error);
  });
};

export const updateBook = async (
  id: number,
  updateData: Partial<Book>
): Promise<Book | null> => {
  const db = await getDB();
  const existingBook = await getBookById(id);

  if (!existingBook) return null;

  const updatedBook = { ...existingBook, ...updateData };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(updatedBook);

    request.onsuccess = () => resolve(updatedBook);
    request.onerror = () => reject(request.error);
  });
};

export const deleteBook = async (id: number): Promise<boolean> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

export const getBooksByAuthor = async (
  authorId: number,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Book>> => {
  const books = await getAllBooks();
  const authorBooks = books.data.filter((book) => book.author_id === authorId);

  if (!pagination) {
    return {
      data: authorBooks,
      total: authorBooks.length,
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
  }

  const { page, limit } = pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = authorBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(authorBooks.length / limit);

  return {
    data: paginatedBooks,
    total: authorBooks.length,
    currentPage: page,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};
