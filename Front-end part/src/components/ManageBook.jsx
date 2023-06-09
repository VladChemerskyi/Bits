import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BOOKS_ENDPOINT, DEFAULT_BOOK_INIT, ISBN_LENGTH } from "../constants";

const ManageBook = () => {
  const navigate = useNavigate();
  const { bookid } = useParams();

  const isEditing = !!bookid;
  const [bookData, setBookData] = useState(DEFAULT_BOOK_INIT);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchBook();
    }
  }, [isEditing]);

  const fetchBook = async () => {
    try {
      const response = await fetch(BOOKS_ENDPOINT);
      //to impove a single
      const data = await response.json();
      const book = data.find((elem) => elem.id === Number(bookid));
      setBookData(book || bookData);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { title, author, category, isbn, isActive, createdAt } = bookData;

    if (!title || !author || !category || !isbn) {
      setErrorMessage("All fields are required");
      return;
    }

    const isbnLength = isbn.toString().length;

    if (isbnLength < ISBN_LENGTH) {
      const missingDigits = ISBN_LENGTH - isbnLength;
      setErrorMessage(
        `ISBN should be a 13-digit number, you missed ${missingDigits} digits`
      );
      return;
    }

    if (isbnLength > ISBN_LENGTH) {
      const extraDigits = isbnLength - ISBN_LENGTH;
      setErrorMessage(
        `ISBN should be a 13-digit number, you have to get rid of ${extraDigits} digits`
      );
      return;
    }

    const now = new Date();
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const updatedBook = {
      createdAt: isEditing ? createdAt : now.toLocaleString("en-US", options),
      modifiedAt: isEditing ? now.toLocaleString("en-US", options) : "--",
      title,
      author,
      category,
      isbn,
      isActive,
    };

    const endpoint = isEditing ? `${BOOKS_ENDPOINT}/${bookid}` : BOOKS_ENDPOINT;

    try {
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (response.ok) {
        setErrorMessage("");
        alert(`Book successfully ${isEditing ? "updated" : "added"}.`);
        navigate(`/dashboard`);
      } else {
        throw new Error("Failed to save the book.");
      }
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const { title, author, category, isbn } = bookData;
  const pageTitle = isEditing ? "Edit a Book" : "Add a Book";
  const submitButtonLabel = isEditing ? "Update Book" : "Add a Book";

  return (
    <div className="add-edit-page">
      <h1 className="add-edit-page__title">{pageTitle}</h1>
      <div className="data__block">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label-name">Title:</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="label-name">Author:</label>
            <input
              type="text"
              name="author"
              value={author}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="label-name">Category:</label>
            <select
              name="category"
              value={category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
            </select>
          </div>

          <div>
            <label className="label-name">ISBN:</label>
            <input
              type="number"
              name="isbn"
              value={isbn}
              onChange={handleInputChange}
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="add-a-book__button-block">
            <button className="add-a-book__button" type="submit">
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
      <div>
        <Link to="/dashboard">
          <button className="add-book__button add-edit__button">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ManageBook;
