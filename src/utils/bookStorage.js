import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_STORAGE_KEY = '@reading_tracker_books';

export const BookStorage = {
  // Get all books from storage
  async getBooks() {
    try {
      const booksJson = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
      return booksJson ? JSON.parse(booksJson) : [];
    } catch (error) {
      console.error('Error getting books:', error);
      return [];
    }
  },

  // Save all books to storage
  async saveBooks(books) {
    try {
      await AsyncStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
      return true;
    } catch (error) {
      console.error('Error saving books:', error);
      return false;
    }
  },

  // Add a new book
  async addBook(book) {
    try {
      const books = await this.getBooks();
      const newBook = {
        id: Date.now().toString(), // Simple ID generation
        title: book.title,
        totalPages: parseInt(book.totalPages),
        pagesRead: 0,
        createdAt: new Date().toISOString(),
      };
      
      books.push(newBook);
      await this.saveBooks(books);
      return newBook;
    } catch (error) {
      console.error('Error adding book:', error);
      return null;
    }
  },

  // Update book progress
  async updateProgress(bookId, pagesReadToday) {
    try {
      const books = await this.getBooks();
      const bookIndex = books.findIndex(book => book.id === bookId);
      
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }

      books[bookIndex].pagesRead += parseInt(pagesReadToday);
      
      // Ensure pagesRead doesn't exceed totalPages
      if (books[bookIndex].pagesRead > books[bookIndex].totalPages) {
        books[bookIndex].pagesRead = books[bookIndex].totalPages;
      }

      await this.saveBooks(books);
      return books[bookIndex];
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  },

  // Get a specific book by ID
  async getBook(bookId) {
    try {
      const books = await this.getBooks();
      return books.find(book => book.id === bookId);
    } catch (error) {
      console.error('Error getting book:', error);
      return null;
    }
  },

  // Delete a book
  async deleteBook(bookId) {
    try {
      const books = await this.getBooks();
      const filteredBooks = books.filter(book => book.id !== bookId);
      await this.saveBooks(filteredBooks);
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  },

  // Clear all books (for testing/reset)
  async clearAllBooks() {
    try {
      await AsyncStorage.removeItem(BOOKS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing books:', error);
      return false;
    }
  }
};
