import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BOOK_STATUS, BOOKS_ENDPOINT } from "../constants";
const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState(BOOK_STATUS.ACTIVE);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(BOOKS_ENDPOINT);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const filteredBooks = books.filter((book) => {
    if (filter === BOOK_STATUS.ACTIVE) {
      return book.isActive;
    }
    if (filter === BOOK_STATUS.DEACTIVATED) {
      return !book.isActive;
    }
    return true;
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = (bookId) => {
    fetch(`${BOOKS_ENDPOINT}/${bookId}`, {
      method: "DELETE",
    });
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
  };

  const handleDeactivate = async (bookId) => {
    const targetBook = books.find((book) => book.id === bookId);

    await fetch(`${BOOKS_ENDPOINT}/${bookId}`, {
      method: "PUT",
      body: JSON.stringify({ ...targetBook, isActive: !targetBook.isActive }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await fetchBooks();
  };

  return (
    <div>
      <h1 className="main-page__title">Dashboard</h1>

      <div className="panel">
        <select value={filter} onChange={handleFilterChange} className="filter">
          <option value="all">Show All</option>
          <option value="active">Show Active</option>
          <option value="deactivated">Show Deactivated</option>
        </select>
        <p>
          Showing {filteredBooks.length} of {books.length} records
        </p>
        <Link to="/manage-book">
          <button className="add-book__button">Add a Book</button>
        </Link>
      </div>

      <table id="dashboard">
        <thead>
          <tr>
            <th>Book title</th>
            <th>Author name</th>
            <th>Category</th>
            <th>ISBN</th>
            <th>Created At</th>
            <th>Modified/Edited At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.isbn}</td>
              <td>{book.createdAt}</td>
              <td>{book.modifiedAt}</td>
              <td className="functional-buttons">
                <Link to={`/manage-book/${book.id}`}>
                  <button>Edit</button>
                </Link>

                {!book.isActive ? (
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                ) : (
                  <></>
                )}

                <button onClick={() => handleDeactivate(book.id)}>
                  {book.isActive ? "Deactivate" : "Re-Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <a
          href="https://github.com/VladChemerskyi"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vladyslav's GitHub
        </a>
      </footer>
    </div>
  );
};

export default Dashboard;
