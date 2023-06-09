export const BASE_URL = "http://localhost:3000";

export const BOOKS_ENDPOINT = `${BASE_URL}/books`;
export const ISBN_LENGTH = 13;
export const BOOK_STATUS = {
  ACTIVE: "active",
  DEACTIVATED: "deactivated",
};

export const DEFAULT_BOOK_INIT = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  isActive: true,
};
