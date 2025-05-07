import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './styles.css';

export default function BookList({ token, updated, refresh, onEdit }) {
  const [books, setBooks] = useState([]);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (error) {
      console.error('Erreur chargement livres', error);
      toast.error(error.response?.data?.error || "❌ Erreur lors du chargement des livres.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
    }
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || "✅ Livre supprimé avec succès !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
      refresh();
    } catch (error) {
      console.error('Erreur suppression livre', error);
      toast.error(error.response?.data?.error || "❌ Erreur lors de la suppression du livre.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [updated, fetchBooks]);

  return (
    <div className="book-list">
      <h2>Liste des livres</h2>
      <ul>
        {books.map(book => (
          <li key={book.id} className="book-item">
            <div>
              <strong>{book.title}</strong> - {book.author}<br />
              <em>{book.description}</em>
            </div>
            <div className="book-actions">
              <button
                className="icon-btn edit-btn"
                title="Modifier"
                onClick={() => onEdit(book)}
              >
                <FaEdit />
              </button>
              <button
                className="icon-btn delete-btn"
                title="Supprimer"
                onClick={() => handleDelete(book.id)}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}